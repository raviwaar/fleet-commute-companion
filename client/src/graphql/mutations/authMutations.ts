import { gql } from "@apollo/client";

// ----------------------
// 1. REGISTER USER
// ----------------------
export const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
  ) {
    registerUser(
      username: $username
      email: $email
      password: $password
    ) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

// ----------------------
// 2. LOGIN
// ----------------------
export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      refreshExpiresIn
      token
    }
  }
`;

// ----------------------
// 3. UPDATE USER PROFILE
// ----------------------
export const UPDATE_USER_PROFILE = gql`
  mutation updateUser($firstName: String, $lastName: String, $profileImage: String, $phoneNumber: String) {
    updateUser(firstName: $firstName, lastName: $lastName, profileImage: $profileImage, phoneNumber: $phoneNumber) {
      user {
        id
        username
        email
        firstName
        lastName
        phoneNumber
        profileImage
      }
    }
  }
`;