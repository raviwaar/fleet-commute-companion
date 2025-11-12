import { gql } from "@apollo/client";

export const ADD_ORG_MEMBER = gql`
  mutation AddOrgMember($organisationId: ID!, $memberUsername: String!, $makeAdmin: Boolean!) {
    addMemberToOrganisation(
      organisationId: $organisationId,
      memberUsername: $memberUsername,
      makeAdmin: $makeAdmin
    ) {
      membership {
        id
        user {
          id
          username
          email
        }
        isOrgAdmin
      }
    }
  }
`;

// Remove a member
export const REMOVE_ORG_MEMBER = gql`
  mutation RemoveOrgMember($organisationId: ID!, $memberId: ID!) {
    removeMemberFromOrganisation(
      organisationId: $organisationId,
      memberId: $memberId
    ) {
      success
    }
  }
`;

// Update member role / admin status
export const UPDATE_MEMBER_ROLE = gql`
  mutation UpdateMemberRole($organisationId: ID!, $memberId: ID!, $isOrgAdmin: Boolean!) {
    updateOrganisationMembership(
      organisationId: $organisationId,
      memberId: $memberId,
      isOrgAdmin: $isOrgAdmin
    ) {
      membership {
        id
        isOrgAdmin
      }
    }
  }
`;
