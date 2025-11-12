import graphene
from graphql import GraphQLError
from django.contrib.auth import get_user_model

# Assume OrganizationMembership model is imported or referenced
# from apps.organisations.models import OrganizationMembership

User = get_user_model()


# --- 1. CORE PERMISSION CLASSES ---

class BasePermission:
    """Base class for all custom permissions to inherit from."""

    @staticmethod
    def has_node_permission(info, id):
        """Permission check for accessing a single node/object."""
        # Default: Allow access if authenticated, override as needed
        return info.context.user.is_authenticated, "Authentication required."

    @staticmethod
    def has_mutation_permission(root, info, input):
        """Permission check for running a mutation."""
        # Default: Allow access if authenticated, override as needed
        return info.context.user.is_authenticated, "Authentication required."

    @staticmethod
    def has_filter_permission(info):
        """Permission check for filtering collections (used by AuthFilter)."""
        # Default: Allow access if authenticated, override as needed
        return info.context.user.is_authenticated, "Authentication required."


class AllowAny(BasePermission):
    """Allows access to any user, authenticated or not."""

    @staticmethod
    def has_mutation_permission(root, info, input):
        return True, ""


class AllowAuthenticated(BasePermission):
    """Allows access only to authenticated users."""

    @staticmethod
    def has_mutation_permission(root, info, input):
        user = info.context.user
        if user.is_authenticated:
            return True, ""
        return False, "Authentication required."

    @staticmethod
    def has_node_permission(info, id):
        return AllowAuthenticated.has_mutation_permission(None, info, None)

    @staticmethod
    def has_filter_permission(info):
        return AllowAuthenticated.has_mutation_permission(None, info, None)


class AllowSuperAdmin(BasePermission):
    """Allows access only to superuser accounts."""

    @staticmethod
    def has_mutation_permission(root, info, input):
        user = info.context.user
        if user.is_authenticated and user.is_superuser:
            return True, ""
        return False, "Super Admin privileges required."


class AllowOrgMember(BasePermission):
    """Allows access only if the user is a member of the organization specified in the input."""

    @staticmethod
    def has_mutation_permission(root, info, input):
        user = info.context.user

        # Check if the user is authenticated first
        if not user.is_authenticated:
            return False, "Authentication required to check organization membership."

        # Organisation ID can be passed as 'organisationId', 'orgId', or similar.
        # We assume 'organisationId' for consistency with Relay/Graphene conventions.
        organisation_id = input.get('organisationId')
        if not organisation_id:
            # We cannot check membership if we don't know the organization ID
            return False, "The target organisation ID is missing from the input."

        # NOTE: In a real Django application, we would decode the global ID
        # and query the OrganizationMembership model directly.
        # Placeholder logic using the assumed reverse relationship 'memberships'
        try:
            from graphene.utils.resolve_only_args import get_global_id
            from graphql_relay.node.node import from_global_id

            # Decode the organization's global ID to its local ID
            org_type, local_id = from_global_id(organisation_id)

            # Placeholder: Check if user has a membership for this local_id
            is_member = user.memberships.filter(organisation_id=local_id).exists()

            if is_member:
                return True, ""
            return False, "You are not a member of this organization."

        except Exception:
            # Handle cases where the ID is invalid or models aren't set up yet
            return False, "Invalid organization ID or database error during membership check."


class AllowOrgAdmin(BasePermission):
    """Allows access only if the user is an admin or owner of the organization specified in the input."""

    @staticmethod
    def has_mutation_permission(root, info, input):
        user = info.context.user

        if not user.is_authenticated:
            return False, "Authentication required to check organization admin status."

        organisation_id = input.get('organisationId')
        if not organisation_id:
            return False, "The target organisation ID is missing from the input."

        try:
            from graphql_relay.node.node import from_global_id

            # Decode the organization's global ID to its local ID
            org_type, local_id = from_global_id(organisation_id)

            # Placeholder: Check if user has an ADMIN or OWNER role for this local_id
            is_admin = user.memberships.filter(
                organisation_id=local_id,
                role__in=['ADMIN', 'OWNER']
            ).exists()

            if is_admin:
                return True, ""
            return False, "Organization Admin privileges required for this action."

        except Exception:
            return False, "Invalid organization ID or database error during admin check."


# --- 2. AUTH MIXIN CLASSES ---

class AuthMutation(graphene.ClientIDMutation):
    """
    Mixin that enforces permissions defined in the 'permission_classes' tuple
    on the Meta class before executing the mutation's logic.
    """

    class Meta:
        abstract = True
        # Subclasses must define permission_classes = (PermissionClass1, ...)

    @classmethod
    def has_permission(cls, root, info, input):
        """Checks permissions against all classes in Meta.permission_classes."""

        if not hasattr(cls.Meta, 'permission_classes'):
            raise GraphQLError("Permission classes are not defined for this mutation.")

        for PermissionClass in cls.Meta.permission_classes:
            has_perm, message = PermissionClass.has_mutation_permission(root, info, input)
            if not has_perm:
                # Deny access and raise the specific error message
                raise GraphQLError(message)

        return True

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        # 1. Enforce Permissions
        if cls.has_permission(root, info, input):
            # 2. Call the actual business logic method
            return cls.perform_mutation(root, info, **input)

        # If has_permission returns False but doesn't raise (unlikely due to current logic), return the empty mutation payload
        return cls()

    @classmethod
    def perform_mutation(cls, root, info, **input):
        """The business logic hook for subclasses to implement."""
        raise NotImplementedError("Subclasses must implement perform_mutation.")