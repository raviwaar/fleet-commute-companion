import graphene
import graphql_jwt
from apps.users.schema import UserMutation, UserQuery
from apps.organisations.schema import (
    OrganisationQuery,
    CreateOrganisation,
    UpdateOrganisation,
    AddMemberToOrganisation,
    UpdateOrganisationMembership,
    RemoveMemberFromOrganisation
)

class Query( UserQuery, OrganisationQuery, graphene.ObjectType):
    hello = graphene.String(default_value="Hello, world!")


class Mutation( UserMutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    create_organisation = CreateOrganisation.Field()
    update_organisation = UpdateOrganisation.Field()
    add_member_to_organisation = AddMemberToOrganisation.Field()
    update_organisation_membership = UpdateOrganisationMembership.Field()
    remove_member_from_organisation = RemoveMemberFromOrganisation.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

# Create schema
schema = graphene.Schema(query=Query, mutation=Mutation)