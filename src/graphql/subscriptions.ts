/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateProfile = /* GraphQL */ `subscription OnCreateProfile(
  $filter: ModelSubscriptionProfileFilterInput
  $owner: String
) {
  onCreateProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateProfileSubscriptionVariables,
  APITypes.OnCreateProfileSubscription
>;
export const onUpdateProfile = /* GraphQL */ `subscription OnUpdateProfile(
  $filter: ModelSubscriptionProfileFilterInput
  $owner: String
) {
  onUpdateProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateProfileSubscriptionVariables,
  APITypes.OnUpdateProfileSubscription
>;
export const onDeleteProfile = /* GraphQL */ `subscription OnDeleteProfile(
  $filter: ModelSubscriptionProfileFilterInput
  $owner: String
) {
  onDeleteProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteProfileSubscriptionVariables,
  APITypes.OnDeleteProfileSubscription
>;
export const onCreateUserRole = /* GraphQL */ `subscription OnCreateUserRole(
  $filter: ModelSubscriptionUserRoleFilterInput
  $owner: String
) {
  onCreateUserRole(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserRoleSubscriptionVariables,
  APITypes.OnCreateUserRoleSubscription
>;
export const onUpdateUserRole = /* GraphQL */ `subscription OnUpdateUserRole(
  $filter: ModelSubscriptionUserRoleFilterInput
  $owner: String
) {
  onUpdateUserRole(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserRoleSubscriptionVariables,
  APITypes.OnUpdateUserRoleSubscription
>;
export const onDeleteUserRole = /* GraphQL */ `subscription OnDeleteUserRole(
  $filter: ModelSubscriptionUserRoleFilterInput
  $owner: String
) {
  onDeleteUserRole(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserRoleSubscriptionVariables,
  APITypes.OnDeleteUserRoleSubscription
>;
export const onCreateBusinessProfile = /* GraphQL */ `subscription OnCreateBusinessProfile(
  $filter: ModelSubscriptionBusinessProfileFilterInput
  $owner: String
) {
  onCreateBusinessProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateBusinessProfileSubscriptionVariables,
  APITypes.OnCreateBusinessProfileSubscription
>;
export const onUpdateBusinessProfile = /* GraphQL */ `subscription OnUpdateBusinessProfile(
  $filter: ModelSubscriptionBusinessProfileFilterInput
  $owner: String
) {
  onUpdateBusinessProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateBusinessProfileSubscriptionVariables,
  APITypes.OnUpdateBusinessProfileSubscription
>;
export const onDeleteBusinessProfile = /* GraphQL */ `subscription OnDeleteBusinessProfile(
  $filter: ModelSubscriptionBusinessProfileFilterInput
  $owner: String
) {
  onDeleteBusinessProfile(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteBusinessProfileSubscriptionVariables,
  APITypes.OnDeleteBusinessProfileSubscription
>;
