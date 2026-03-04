/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createProfile = /* GraphQL */ `mutation CreateProfile(
  $input: CreateProfileInput!
  $condition: ModelProfileConditionInput
) {
  createProfile(input: $input, condition: $condition) {
    id
    full_name
    avatar_url
    roles {
      nextToken
      __typename
    }
    businessProfile {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    profileBusinessProfileId
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateProfileMutationVariables,
  APITypes.CreateProfileMutation
>;
export const updateProfile = /* GraphQL */ `mutation UpdateProfile(
  $input: UpdateProfileInput!
  $condition: ModelProfileConditionInput
) {
  updateProfile(input: $input, condition: $condition) {
    id
    full_name
    avatar_url
    roles {
      nextToken
      __typename
    }
    businessProfile {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    profileBusinessProfileId
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateProfileMutationVariables,
  APITypes.UpdateProfileMutation
>;
export const deleteProfile = /* GraphQL */ `mutation DeleteProfile(
  $input: DeleteProfileInput!
  $condition: ModelProfileConditionInput
) {
  deleteProfile(input: $input, condition: $condition) {
    id
    full_name
    avatar_url
    roles {
      nextToken
      __typename
    }
    businessProfile {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      createdAt
      updatedAt
      owner
      __typename
    }
    createdAt
    updatedAt
    profileBusinessProfileId
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteProfileMutationVariables,
  APITypes.DeleteProfileMutation
>;
export const createUserRole = /* GraphQL */ `mutation CreateUserRole(
  $input: CreateUserRoleInput!
  $condition: ModelUserRoleConditionInput
) {
  createUserRole(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    role
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserRoleMutationVariables,
  APITypes.CreateUserRoleMutation
>;
export const updateUserRole = /* GraphQL */ `mutation UpdateUserRole(
  $input: UpdateUserRoleInput!
  $condition: ModelUserRoleConditionInput
) {
  updateUserRole(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    role
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserRoleMutationVariables,
  APITypes.UpdateUserRoleMutation
>;
export const deleteUserRole = /* GraphQL */ `mutation DeleteUserRole(
  $input: DeleteUserRoleInput!
  $condition: ModelUserRoleConditionInput
) {
  deleteUserRole(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    role
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserRoleMutationVariables,
  APITypes.DeleteUserRoleMutation
>;
export const createBusinessProfile = /* GraphQL */ `mutation CreateBusinessProfile(
  $input: CreateBusinessProfileInput!
  $condition: ModelBusinessProfileConditionInput
) {
  createBusinessProfile(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    business_name
    category
    description
    address
    phone
    website
    price_level
    languages
    is_minority_owned
    is_howard_affiliated
    verification_status
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBusinessProfileMutationVariables,
  APITypes.CreateBusinessProfileMutation
>;
export const updateBusinessProfile = /* GraphQL */ `mutation UpdateBusinessProfile(
  $input: UpdateBusinessProfileInput!
  $condition: ModelBusinessProfileConditionInput
) {
  updateBusinessProfile(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    business_name
    category
    description
    address
    phone
    website
    price_level
    languages
    is_minority_owned
    is_howard_affiliated
    verification_status
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBusinessProfileMutationVariables,
  APITypes.UpdateBusinessProfileMutation
>;
export const deleteBusinessProfile = /* GraphQL */ `mutation DeleteBusinessProfile(
  $input: DeleteBusinessProfileInput!
  $condition: ModelBusinessProfileConditionInput
) {
  deleteBusinessProfile(input: $input, condition: $condition) {
    id
    profileID
    profile {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    business_name
    category
    description
    address
    phone
    website
    price_level
    languages
    is_minority_owned
    is_howard_affiliated
    verification_status
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBusinessProfileMutationVariables,
  APITypes.DeleteBusinessProfileMutation
>;
