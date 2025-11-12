import { gql } from "@apollo/client";

export const GET_USER_MEMBERSHIPS = gql`
  query GetUserMemberships {
    myMemberships {
      id
      isOrgAdmin
      organisation {
        id
        name
        memberCount
      }
    }
  }
`;

export const GET_ORG_MEMBERS = gql`
  query GetOrgMembers($orgId: ID!) {
    allMemberships(organisationId: $orgId) {
      id
      user {
        id
        username
        email
      }
      isOrgAdmin
    }
  }
`;