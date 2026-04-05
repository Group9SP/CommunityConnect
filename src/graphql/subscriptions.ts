/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

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
` as GeneratedSubscription<
  APITypes.OnDeleteProfileSubscriptionVariables,
  APITypes.OnDeleteProfileSubscription
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
` as GeneratedSubscription<
  APITypes.OnDeleteBusinessProfileSubscriptionVariables,
  APITypes.OnDeleteBusinessProfileSubscription
>;
export const onCreateReview = /* GraphQL */ `subscription OnCreateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onCreateReview(filter: $filter, owner: $owner) {
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
    review_name
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
` as GeneratedSubscription<
  APITypes.OnCreateReviewSubscriptionVariables,
  APITypes.OnCreateReviewSubscription
>;
export const onUpdateReview = /* GraphQL */ `subscription OnUpdateReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onUpdateReview(filter: $filter, owner: $owner) {
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
    review_name
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
` as GeneratedSubscription<
  APITypes.OnUpdateReviewSubscriptionVariables,
  APITypes.OnUpdateReviewSubscription
>;
export const onDeleteReview = /* GraphQL */ `subscription OnDeleteReview(
  $filter: ModelSubscriptionReviewFilterInput
  $owner: String
) {
  onDeleteReview(filter: $filter, owner: $owner) {
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
    review_name
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
` as GeneratedSubscription<
  APITypes.OnDeleteReviewSubscriptionVariables,
  APITypes.OnDeleteReviewSubscription
>;
export const onCreateReviewComment = /* GraphQL */ `subscription OnCreateReviewComment(
  $filter: ModelSubscriptionReviewCommentFilterInput
  $owner: String
) {
  onCreateReviewComment(filter: $filter, owner: $owner) {
    id
    reviewID
    review {
      id
      rating
      comment
      userID
      businessID
      review_name
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
` as GeneratedSubscription<
  APITypes.OnCreateReviewCommentSubscriptionVariables,
  APITypes.OnCreateReviewCommentSubscription
>;
export const onUpdateReviewComment = /* GraphQL */ `subscription OnUpdateReviewComment(
  $filter: ModelSubscriptionReviewCommentFilterInput
  $owner: String
) {
  onUpdateReviewComment(filter: $filter, owner: $owner) {
    id
    reviewID
    review {
      id
      rating
      comment
      userID
      businessID
      review_name
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
` as GeneratedSubscription<
  APITypes.OnUpdateReviewCommentSubscriptionVariables,
  APITypes.OnUpdateReviewCommentSubscription
>;
export const onDeleteReviewComment = /* GraphQL */ `subscription OnDeleteReviewComment(
  $filter: ModelSubscriptionReviewCommentFilterInput
  $owner: String
) {
  onDeleteReviewComment(filter: $filter, owner: $owner) {
    id
    reviewID
    review {
      id
      rating
      comment
      userID
      businessID
      review_name
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
` as GeneratedSubscription<
  APITypes.OnDeleteReviewCommentSubscriptionVariables,
  APITypes.OnDeleteReviewCommentSubscription
>;
