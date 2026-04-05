/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

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
      hours
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      logo_url
      createdAt
      updatedAt
      owner
      __typename
    }
    reviews {
      nextToken
      __typename
    }
    reviewComments {
      nextToken
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
    hours
    price_level
    languages
    is_minority_owned
    is_howard_affiliated
    verification_status
    logo_url
    reviews {
      nextToken
      __typename
    }
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
      hours
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      logo_url
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
export const businessProfilesByCategory = /* GraphQL */ `query BusinessProfilesByCategory(
  $category: String!
  $sortDirection: ModelSortDirection
  $filter: ModelBusinessProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  businessProfilesByCategory(
    category: $category
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      hours
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      logo_url
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
  APITypes.BusinessProfilesByCategoryQueryVariables,
  APITypes.BusinessProfilesByCategoryQuery
>;
export const businessProfilesByAddress = /* GraphQL */ `query BusinessProfilesByAddress(
  $address: String!
  $sortDirection: ModelSortDirection
  $filter: ModelBusinessProfileFilterInput
  $limit: Int
  $nextToken: String
) {
  businessProfilesByAddress(
    address: $address
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      hours
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      logo_url
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
  APITypes.BusinessProfilesByAddressQueryVariables,
  APITypes.BusinessProfilesByAddressQuery
>;
export const getReview = /* GraphQL */ `query GetReview($id: ID!) {
  getReview(id: $id) {
    id
    rating
    comment
    userID
    user {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    businessID
    business {
      id
      profileID
      business_name
      category
      description
      address
      phone
      website
      hours
      price_level
      languages
      is_minority_owned
      is_howard_affiliated
      verification_status
      logo_url
      createdAt
      updatedAt
      owner
      __typename
    }
    moderation_status
    createdAt
    updatedAt
    editableUntil
    comments {
      nextToken
      __typename
    }
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetReviewQueryVariables, APITypes.GetReviewQuery>;
export const listReviews = /* GraphQL */ `query ListReviews(
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      rating
      comment
      userID
      businessID
      moderation_status
      createdAt
      updatedAt
      editableUntil
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReviewsQueryVariables,
  APITypes.ListReviewsQuery
>;
export const reviewsByUserID = /* GraphQL */ `query ReviewsByUserID(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  reviewsByUserID(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      rating
      comment
      userID
      businessID
      moderation_status
      createdAt
      updatedAt
      editableUntil
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ReviewsByUserIDQueryVariables,
  APITypes.ReviewsByUserIDQuery
>;
export const reviewsByBusinessID = /* GraphQL */ `query ReviewsByBusinessID(
  $businessID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelReviewFilterInput
  $limit: Int
  $nextToken: String
) {
  reviewsByBusinessID(
    businessID: $businessID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      rating
      comment
      userID
      businessID
      moderation_status
      createdAt
      updatedAt
      editableUntil
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ReviewsByBusinessIDQueryVariables,
  APITypes.ReviewsByBusinessIDQuery
>;
export const getReviewComment = /* GraphQL */ `query GetReviewComment($id: ID!) {
  getReviewComment(id: $id) {
    id
    reviewID
    review {
      id
      rating
      comment
      userID
      businessID
      moderation_status
      createdAt
      updatedAt
      editableUntil
      owner
      __typename
    }
    userID
    user {
      id
      full_name
      avatar_url
      createdAt
      updatedAt
      profileBusinessProfileId
      owner
      __typename
    }
    comment
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetReviewCommentQueryVariables,
  APITypes.GetReviewCommentQuery
>;
export const listReviewComments = /* GraphQL */ `query ListReviewComments(
  $filter: ModelReviewCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  listReviewComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      reviewID
      userID
      comment
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
  APITypes.ListReviewCommentsQueryVariables,
  APITypes.ListReviewCommentsQuery
>;
export const reviewCommentsByReviewID = /* GraphQL */ `query ReviewCommentsByReviewID(
  $reviewID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelReviewCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  reviewCommentsByReviewID(
    reviewID: $reviewID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      reviewID
      userID
      comment
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
  APITypes.ReviewCommentsByReviewIDQueryVariables,
  APITypes.ReviewCommentsByReviewIDQuery
>;
export const reviewCommentsByUserID = /* GraphQL */ `query ReviewCommentsByUserID(
  $userID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelReviewCommentFilterInput
  $limit: Int
  $nextToken: String
) {
  reviewCommentsByUserID(
    userID: $userID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      reviewID
      userID
      comment
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
  APITypes.ReviewCommentsByUserIDQueryVariables,
  APITypes.ReviewCommentsByUserIDQuery
>;
