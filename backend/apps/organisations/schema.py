import graphene
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_relay.node.node import from_global_id
from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model
from django.db.models import Q

# Assuming these are the correct model import paths
from .models import Organisation, OrganisationMembership

# We no longer need to import the custom permission classes from core
# as we are implementing basic checks inline.

User = get_user_model()


# --- LOCAL HELPER FUNCTIONS ---

def _get_organisation_and_check_admin(info, organisation_id):
    """Retrieves organisation and checks if the requesting user is an Admin or SuperUser.

    This function MUST decode the Graphene Global ID before querying the Django ORM.
    """
    user = info.context.user
    if not user.is_authenticated:
        raise GraphQLError("Authentication required.")

    try:
        # CRITICAL FIX: Decode the Global ID (Base64 string) back to the local UUID (PK)
        type_name, org_local_id = from_global_id(organisation_id)

        # Optional: Check if the decoded type matches the expected model (best practice)
        if type_name != 'OrganisationType':
            raise GraphQLError(f"Invalid ID type provided. Expected OrganisationType, received {type_name}.")

        organisation = Organisation.objects.get(pk=org_local_id)

    except Organisation.DoesNotExist:
        raise GraphQLError("Organisation not found.")
    except ValueError:
        raise GraphQLError("Invalid Organisation ID format.")
    except Exception as e:
        # Catch the specific error raised by the type check if it occurs
        if "Invalid ID type provided" in str(e):
            raise GraphQLError(str(e))
        # Re-raise generic errors that may occur during decoding/lookup
        raise

    if user.is_superuser:
        return organisation

    # Check for Admin status within the organization
    is_admin = OrganisationMembership.objects.filter(
        organisation=organisation,
        user=user,
        is_org_admin=True
    ).exists()

    if not is_admin:
        raise GraphQLError("Permission Denied: Organisation Admin privileges required.")

    return organisation


# --- 1. TYPES ---

class OrganisationMembershipType(DjangoObjectType):
    """GraphQL Type for OrganisationMembership."""

    class Meta:
        model = OrganisationMembership
        fields = ('id', 'user', 'organisation', 'is_org_admin')
        interfaces = (graphene.Node,)


class OrganisationType(DjangoObjectType):
    """GraphQL Type for the Organisation model."""
    member_count = graphene.Int()
    memberships = graphene.List(OrganisationMembershipType)

    class Meta:
        model = Organisation
        fields = ('id', 'name', 'slug', 'created_by', 'is_active', 'is_public', 'created_at', 'users')
        interfaces = (graphene.Node,)

    def resolve_member_count(root, info):
        return root.users.count()

    def resolve_memberships(root, info):
        return root.memberships.all()


# --- 2. QUERIES (RBAC Logic) ---

class OrganisationQuery(graphene.ObjectType):
    """
    Queries related to Organisations using Role-Based Access Control (RBAC).
    These remain largely the same as they use the robust @login_required decorator.
    """

    organisation = graphene.Field(
        OrganisationType,
        id=graphene.ID(required=False),
        slug=graphene.String(required=False),
        description="Retrieve an organization by ID or slug. Requires membership or public status."
    )

    my_organisations = graphene.List(
        OrganisationType,
        description="Lists all organizations the authenticated user is a member of."
    )

    my_memberships = graphene.List(
        OrganisationMembershipType,
        description="Lists all organisation memberships for the authenticated user, including their role."
    )

    all_memberships = graphene.List(
        OrganisationMembershipType,
        organisationId=graphene.ID(required=True),
        description="Lists all memberships for a specific organization (Org Admin required)."
    )

    @login_required
    def resolve_organisation(root, info, id=None, slug=None):
        user = info.context.user

        # 1. Determine the organization object
        try:
            if id:
                type_name, local_id = from_global_id(id)
                org = Organisation.objects.get(pk=local_id)
            elif slug:
                org = Organisation.objects.get(slug=slug)
            else:
                raise GraphQLError("Provide either 'id' or 'slug'.")
        except Organisation.DoesNotExist:
            return None
        except ValueError:
            raise GraphQLError("Invalid Global ID provided.")

        # 2. PERMISSION CHECK:
        if user.is_superuser:
            return org

        is_member = org.users.filter(pk=user.pk).exists()
        if is_member:
            return org

        if org.is_public:
            return org

        raise GraphQLError("Permission Denied: Not a member and organization is private.")

    @login_required
    def resolve_my_organisations(root, info):
        user = info.context.user
        # This returns the Organisation objects directly
        return Organisation.objects.filter(memberships__user=user).distinct()

    @login_required
    def resolve_my_memberships(root, info):
        user = info.context.user
        # This returns the OrganisationMembership objects, which contain the role (is_org_admin)
        return OrganisationMembership.objects.filter(user=user)

    @login_required
    def resolve_all_memberships(root, info, organisationId):
        # CLEANUP: Rely on _get_organisation_and_check_admin to perform all checks and raise GraphQLError on failure.
        organisation = _get_organisation_and_check_admin(info, organisationId)
        return organisation.memberships.all()


# --- 3. MUTATIONS (Basic Inline Checks) ---

class CreateOrganisation(graphene.Mutation):
    """Allows an authenticated user to create a new organisation, making them the initial Admin."""

    class Arguments:
        name = graphene.String(required=True)
        slug = graphene.String(required=True)
        is_public = graphene.Boolean(required=False, default_value=False)

    organisation = graphene.Field(OrganisationType)

    @classmethod
    @login_required
    def mutate(cls, root, info, name, slug, is_public):
        # BASIC CHECK: Authentication is handled by @login_required

        user = info.context.user
        organisation = Organisation.objects.create(
            name=name,
            slug=slug,
            created_by=user,
            is_public=is_public
        )
        # Assign the creator as the initial ORG ADMIN member
        OrganisationMembership.objects.create(
            user=user,
            organisation=organisation,
            is_org_admin=True
        )
        return CreateOrganisation(organisation=organisation)


class UpdateOrganisation(graphene.Mutation):
    """Allows an Org Admin or SuperAdmin to update basic organisation details."""

    class Arguments:
        organisationId = graphene.ID(required=True, description="Global ID of the organisation to update.")
        name = graphene.String(required=False)
        slug = graphene.String(required=False)
        is_public = graphene.Boolean(required=False)

    organisation = graphene.Field(OrganisationType)

    @classmethod
    def mutate(cls, root, info, organisationId, **input):
        # AUTHORIZATION CHECK: Must be an Org Admin or SuperUser
        organisation = _get_organisation_and_check_admin(info, organisationId)

        for field, value in input.items():
            if value is not None:
                if field == 'slug':
                    if Organisation.objects.filter(slug=value).exclude(pk=organisation.pk).exists():
                        raise GraphQLError("Slug is already in use by another organisation.")

                setattr(organisation, field, value)

        organisation.full_clean()
        organisation.save()

        return UpdateOrganisation(organisation=organisation)


class AddMemberToOrganisation(graphene.Mutation):
    """Allows an Organisation Admin to add a new member and optionally set them as an Admin."""

    class Arguments:
        organisationId = graphene.ID(required=True)
        memberUsername = graphene.String(required=True)
        makeAdmin = graphene.Boolean(required=False, default_value=False)

    membership = graphene.Field(OrganisationMembershipType)

    @classmethod
    def mutate(cls, root, info, organisationId, memberUsername, makeAdmin):
        # AUTHORIZATION CHECK: Must be an Org Admin or SuperUser
        organisation = _get_organisation_and_check_admin(info, organisationId)

        # BUSINESS LOGIC
        try:
            new_member = User.objects.get(username=memberUsername)
        except User.DoesNotExist:
            raise GraphQLError("User not found.")

        if organisation.users.filter(pk=new_member.pk).exists():
            raise GraphQLError(f"User '{memberUsername}' is already a member.")

        membership = OrganisationMembership.objects.create(
            user=new_member,
            organisation=organisation,
            is_org_admin=makeAdmin
        )

        return AddMemberToOrganisation(membership=membership)


class UpdateOrganisationMembership(graphene.Mutation):
    """Allows an Org Admin to update the status of another member."""

    class Arguments:
        organisationId = graphene.ID(required=True)
        memberId = graphene.ID(required=True)
        is_org_admin = graphene.Boolean(required=True)

    membership = graphene.Field(OrganisationMembershipType)

    @classmethod
    def mutate(cls, root, info, organisationId, memberId, is_org_admin):
        # AUTHORIZATION CHECK: Must be an Org Admin or SuperUser
        organisation = _get_organisation_and_check_admin(info, organisationId)

        user = info.context.user

        #type_name, member_local_id = from_global_id(memberId)

        try:
            member_to_update = User.objects.get(pk=memberId)
        except User.DoesNotExist:
            raise GraphQLError(f"Member User not found. + {type_name}")

        # GUARDRAIL 1: Prevent Self-Update
        if member_to_update.pk == user.pk:
            raise GraphQLError("Permission Denied: Organisation Admins cannot update their own membership status.")

        try:
            membership = OrganisationMembership.objects.get(
                organisation=organisation,
                user=member_to_update
            )
        except OrganisationMembership.DoesNotExist:
            raise GraphQLError("User is not a member of this organisation.")

        # GUARDRAIL 2: Prevent Last Admin Demotion
        if membership.is_org_admin and not is_org_admin:
            admin_count = OrganisationMembership.objects.filter(
                organisation=organisation, is_org_admin=True
            ).count()

            if admin_count == 1:
                raise GraphQLError("Cannot revoke admin status: The targeted member is the sole Organisation Admin.")

        # Update Status
        membership.is_org_admin = is_org_admin
        membership.save()

        return UpdateOrganisationMembership(membership=membership)


class RemoveMemberFromOrganisation(graphene.Mutation):
    """Allows an Organisation Admin to remove a member, with checks to prevent removing the last admin."""

    class Arguments:
        organisationId = graphene.ID(required=True)
        memberId = graphene.ID(required=True)

    organisation = graphene.Field(OrganisationType)
    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, organisationId, memberId):
        # AUTHORIZATION CHECK: Must be an Org Admin or SuperUser
        organisation = _get_organisation_and_check_admin(info, organisationId)

        user = info.context.user

        #type_name, member_local_id = from_global_id(memberId)

        try:
            member_to_remove = User.objects.get(pk=memberId)
        except User.DoesNotExist:
            raise GraphQLError("Member User not found.")

        if member_to_remove.pk == user.pk:
            raise GraphQLError("Permission Denied: Organisation Admins cannot update their own membership status.")

        # GUARDRAIL: Check if the member to remove is the last admin
        admin_memberships = OrganisationMembership.objects.filter(
            organisation=organisation,
            is_org_admin=True
        )

        is_admin_to_remove = admin_memberships.filter(user=member_to_remove).exists()
        if is_admin_to_remove and admin_memberships.count() == 1:
            raise GraphQLError("Cannot remove the last Organisation Admin.")

        try:
            membership = OrganisationMembership.objects.get(
                organisation=organisation,
                user=member_to_remove
            )
            membership.delete()
        except OrganisationMembership.DoesNotExist:
            raise GraphQLError("User is not a member of this organisation.")

        return RemoveMemberFromOrganisation(organisation=organisation, success=True)


class OrganisationMutation(graphene.ObjectType):
    """Aggregates all Organisation-related mutations."""
    create_organisation = CreateOrganisation.Field()
    update_organisation = UpdateOrganisation.Field()
    add_member_to_organisation = AddMemberToOrganisation.Field()
    update_organisation_membership = UpdateOrganisationMembership.Field()
    remove_member_from_organisation = RemoveMemberFromOrganisation.Field()