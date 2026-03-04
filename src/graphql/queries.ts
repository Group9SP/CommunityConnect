/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getProfile = /* GraphQL */ `query GetProfile($id: ID!) {
  getProfile(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetProfileQueryVariables,
  APITypes.GetProfileQuery
>;
export const listProfiles = /* GraphQL */ `query ListProfiles(
  $filter: ModelProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProfilesQueryVariables,
  APITypes.ListProfilesQuery
>;
export const getUserRole = /* GraphQL */ `query GetUserRole($id: ID!) {
  getUserRole(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserRoleQueryVariables,
  APITypes.GetUserRoleQuery
>;
export const listUserRoles = /* GraphQL */ `query ListUserRoles(
  $filter: ModelUserRoleFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserRoles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      profileID
      role
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserRolesQueryVariables,
  APITypes.ListUserRolesQuery
>;
export const userRolesByProfileID = /* GraphQL */ `query UserRolesByProfileID(
  $profileID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelUserRoleFilterInput
  $limit: Int
  $nextToken: String
) {
  userRolesByProfileID(
    profileID: $profileID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      profileID
      role
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.UserRolesByProfileIDQueryVariables,
  APITypes.UserRolesByProfileIDQuery
>;
export const getBusinessProfile = /* GraphQL */ `query GetBusinessProfile($id: ID!) {
  getBusinessProfile(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBusinessProfileQueryVariables,
  APITypes.GetBusinessProfileQuery
>;
export const listBusinessProfiles = /* GraphQL */ `query ListBusinessProfiles(
  $filter: ModelBusinessProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  listBusinessProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBusinessProfilesQueryVariables,
  APITypes.ListBusinessProfilesQuery
>;
