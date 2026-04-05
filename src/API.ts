/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProfileInput = {
  id?: string | null,
  full_name: string,
  avatar_url?: string | null,
  profileBusinessProfileId?: string | null,
};

export type ModelProfileConditionInput = {
  full_name?: ModelStringInput | null,
  avatar_url?: ModelStringInput | null,
  and?: Array< ModelProfileConditionInput | null > | null,
  or?: Array< ModelProfileConditionInput | null > | null,
  not?: ModelProfileConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  profileBusinessProfileId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Profile = {
  __typename: "Profile",
  id: string,
  full_name: string,
  avatar_url?: string | null,
  roles?: ModelUserRoleConnection | null,
  businessProfile?: BusinessProfile | null,
  reviews?: ModelReviewConnection | null,
  reviewComments?: ModelReviewCommentConnection | null,
  createdAt: string,
  updatedAt: string,
  profileBusinessProfileId?: string | null,
  owner?: string | null,
};

export type ModelUserRoleConnection = {
  __typename: "ModelUserRoleConnection",
  items:  Array<UserRole | null >,
  nextToken?: string | null,
};

export type UserRole = {
  __typename: "UserRole",
  id: string,
  profileID: string,
  profile?: Profile | null,
  role: AppRole,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export enum AppRole {
  business_owner = "business_owner",
  customer = "customer",
}


export type BusinessProfile = {
  __typename: "BusinessProfile",
  id: string,
  profileID: string,
  profile?: Profile | null,
  business_name: string,
  category: string,
  description?: string | null,
  address?: string | null,
  phone?: string | null,
  website?: string | null,
  hours?: string | null,
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
  logo_url?: string | null,
  reviews?: ModelReviewConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export enum VerificationStatus {
  pending = "pending",
  verified = "verified",
  rejected = "rejected",
}


export type ModelReviewConnection = {
  __typename: "ModelReviewConnection",
  items:  Array<Review | null >,
  nextToken?: string | null,
};

export type Review = {
  __typename: "Review",
  id: string,
  rating: number,
  comment: string,
  userID: string,
  user?: Profile | null,
  businessID: string,
  business?: BusinessProfile | null,
  review_name?: string | null,
  moderation_status: ModerationStatus,
  createdAt?: string | null,
  updatedAt?: string | null,
  editableUntil?: string | null,
  comments?: ModelReviewCommentConnection | null,
  owner?: string | null,
};

export enum ModerationStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}


export type ModelReviewCommentConnection = {
  __typename: "ModelReviewCommentConnection",
  items:  Array<ReviewComment | null >,
  nextToken?: string | null,
};

export type ReviewComment = {
  __typename: "ReviewComment",
  id: string,
  reviewID: string,
  review?: Review | null,
  userID: string,
  user?: Profile | null,
  comment: string,
  createdAt?: string | null,
  updatedAt?: string | null,
  owner?: string | null,
};

export type UpdateProfileInput = {
  id: string,
  full_name?: string | null,
  avatar_url?: string | null,
  profileBusinessProfileId?: string | null,
};

export type DeleteProfileInput = {
  id: string,
};

export type CreateUserRoleInput = {
  id?: string | null,
  profileID: string,
  role: AppRole,
};

export type ModelUserRoleConditionInput = {
  profileID?: ModelIDInput | null,
  role?: ModelAppRoleInput | null,
  and?: Array< ModelUserRoleConditionInput | null > | null,
  or?: Array< ModelUserRoleConditionInput | null > | null,
  not?: ModelUserRoleConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelAppRoleInput = {
  eq?: AppRole | null,
  ne?: AppRole | null,
};

export type UpdateUserRoleInput = {
  id: string,
  profileID?: string | null,
  role?: AppRole | null,
};

export type DeleteUserRoleInput = {
  id: string,
};

export type CreateBusinessProfileInput = {
  id?: string | null,
  profileID: string,
  business_name: string,
  category: string,
  description?: string | null,
  address?: string | null,
  phone?: string | null,
  website?: string | null,
  hours?: string | null,
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
  logo_url?: string | null,
};

export type ModelBusinessProfileConditionInput = {
  profileID?: ModelIDInput | null,
  business_name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  description?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  hours?: ModelStringInput | null,
  price_level?: ModelIntInput | null,
  languages?: ModelStringInput | null,
  is_minority_owned?: ModelBooleanInput | null,
  is_howard_affiliated?: ModelBooleanInput | null,
  verification_status?: ModelVerificationStatusInput | null,
  logo_url?: ModelStringInput | null,
  and?: Array< ModelBusinessProfileConditionInput | null > | null,
  or?: Array< ModelBusinessProfileConditionInput | null > | null,
  not?: ModelBusinessProfileConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelVerificationStatusInput = {
  eq?: VerificationStatus | null,
  ne?: VerificationStatus | null,
};

export type UpdateBusinessProfileInput = {
  id: string,
  profileID?: string | null,
  business_name?: string | null,
  category?: string | null,
  description?: string | null,
  address?: string | null,
  phone?: string | null,
  website?: string | null,
  hours?: string | null,
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
  logo_url?: string | null,
};

export type DeleteBusinessProfileInput = {
  id: string,
};

export type CreateReviewInput = {
  id?: string | null,
  rating: number,
  comment: string,
  userID: string,
  businessID: string,
  review_name?: string | null,
  moderation_status: ModerationStatus,
  createdAt?: string | null,
  updatedAt?: string | null,
  editableUntil?: string | null,
};

export type ModelReviewConditionInput = {
  rating?: ModelIntInput | null,
  comment?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  businessID?: ModelIDInput | null,
  review_name?: ModelStringInput | null,
  moderation_status?: ModelModerationStatusInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  editableUntil?: ModelStringInput | null,
  and?: Array< ModelReviewConditionInput | null > | null,
  or?: Array< ModelReviewConditionInput | null > | null,
  not?: ModelReviewConditionInput | null,
  owner?: ModelStringInput | null,
};

export type ModelModerationStatusInput = {
  eq?: ModerationStatus | null,
  ne?: ModerationStatus | null,
};

export type UpdateReviewInput = {
  id: string,
  rating?: number | null,
  comment?: string | null,
  userID?: string | null,
  businessID?: string | null,
  review_name?: string | null,
  moderation_status?: ModerationStatus | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  editableUntil?: string | null,
};

export type DeleteReviewInput = {
  id: string,
};

export type CreateReviewCommentInput = {
  id?: string | null,
  reviewID: string,
  userID: string,
  comment: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelReviewCommentConditionInput = {
  reviewID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelReviewCommentConditionInput | null > | null,
  or?: Array< ModelReviewCommentConditionInput | null > | null,
  not?: ModelReviewCommentConditionInput | null,
  owner?: ModelStringInput | null,
};

export type UpdateReviewCommentInput = {
  id: string,
  reviewID?: string | null,
  userID?: string | null,
  comment?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteReviewCommentInput = {
  id: string,
};

export type ModelUserRoleFilterInput = {
  id?: ModelIDInput | null,
  profileID?: ModelIDInput | null,
  role?: ModelAppRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserRoleFilterInput | null > | null,
  or?: Array< ModelUserRoleFilterInput | null > | null,
  not?: ModelUserRoleFilterInput | null,
  owner?: ModelStringInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelProfileFilterInput = {
  id?: ModelIDInput | null,
  full_name?: ModelStringInput | null,
  avatar_url?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelProfileFilterInput | null > | null,
  or?: Array< ModelProfileFilterInput | null > | null,
  not?: ModelProfileFilterInput | null,
  profileBusinessProfileId?: ModelIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelProfileConnection = {
  __typename: "ModelProfileConnection",
  items:  Array<Profile | null >,
  nextToken?: string | null,
};

export type ModelBusinessProfileFilterInput = {
  id?: ModelIDInput | null,
  profileID?: ModelIDInput | null,
  business_name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  description?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  hours?: ModelStringInput | null,
  price_level?: ModelIntInput | null,
  languages?: ModelStringInput | null,
  is_minority_owned?: ModelBooleanInput | null,
  is_howard_affiliated?: ModelBooleanInput | null,
  verification_status?: ModelVerificationStatusInput | null,
  logo_url?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelBusinessProfileFilterInput | null > | null,
  or?: Array< ModelBusinessProfileFilterInput | null > | null,
  not?: ModelBusinessProfileFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelBusinessProfileConnection = {
  __typename: "ModelBusinessProfileConnection",
  items:  Array<BusinessProfile | null >,
  nextToken?: string | null,
};

export type ModelReviewFilterInput = {
  id?: ModelIDInput | null,
  rating?: ModelIntInput | null,
  comment?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  businessID?: ModelIDInput | null,
  review_name?: ModelStringInput | null,
  moderation_status?: ModelModerationStatusInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  editableUntil?: ModelStringInput | null,
  and?: Array< ModelReviewFilterInput | null > | null,
  or?: Array< ModelReviewFilterInput | null > | null,
  not?: ModelReviewFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelReviewCommentFilterInput = {
  id?: ModelIDInput | null,
  reviewID?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelReviewCommentFilterInput | null > | null,
  or?: Array< ModelReviewCommentFilterInput | null > | null,
  not?: ModelReviewCommentFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionUserRoleFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  profileID?: ModelSubscriptionIDInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserRoleFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserRoleFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  full_name?: ModelSubscriptionStringInput | null,
  avatar_url?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionProfileFilterInput | null > | null,
  profileBusinessProfileId?: ModelSubscriptionIDInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionBusinessProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  profileID?: ModelSubscriptionIDInput | null,
  business_name?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  hours?: ModelSubscriptionStringInput | null,
  price_level?: ModelSubscriptionIntInput | null,
  languages?: ModelSubscriptionStringInput | null,
  is_minority_owned?: ModelSubscriptionBooleanInput | null,
  is_howard_affiliated?: ModelSubscriptionBooleanInput | null,
  verification_status?: ModelSubscriptionStringInput | null,
  logo_url?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBusinessProfileFilterInput | null > | null,
  or?: Array< ModelSubscriptionBusinessProfileFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionReviewFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  rating?: ModelSubscriptionIntInput | null,
  comment?: ModelSubscriptionStringInput | null,
  userID?: ModelSubscriptionIDInput | null,
  businessID?: ModelSubscriptionIDInput | null,
  review_name?: ModelSubscriptionStringInput | null,
  moderation_status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  editableUntil?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  or?: Array< ModelSubscriptionReviewFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionReviewCommentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  reviewID?: ModelSubscriptionIDInput | null,
  userID?: ModelSubscriptionIDInput | null,
  comment?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionReviewCommentFilterInput | null > | null,
  or?: Array< ModelSubscriptionReviewCommentFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type CreateProfileMutationVariables = {
  input: CreateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type CreateProfileMutation = {
  createProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateProfileMutationVariables = {
  input: UpdateProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type UpdateProfileMutation = {
  updateProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteProfileMutationVariables = {
  input: DeleteProfileInput,
  condition?: ModelProfileConditionInput | null,
};

export type DeleteProfileMutation = {
  deleteProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type CreateUserRoleMutationVariables = {
  input: CreateUserRoleInput,
  condition?: ModelUserRoleConditionInput | null,
};

export type CreateUserRoleMutation = {
  createUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateUserRoleMutationVariables = {
  input: UpdateUserRoleInput,
  condition?: ModelUserRoleConditionInput | null,
};

export type UpdateUserRoleMutation = {
  updateUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteUserRoleMutationVariables = {
  input: DeleteUserRoleInput,
  condition?: ModelUserRoleConditionInput | null,
};

export type DeleteUserRoleMutation = {
  deleteUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateBusinessProfileMutationVariables = {
  input: CreateBusinessProfileInput,
  condition?: ModelBusinessProfileConditionInput | null,
};

export type CreateBusinessProfileMutation = {
  createBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateBusinessProfileMutationVariables = {
  input: UpdateBusinessProfileInput,
  condition?: ModelBusinessProfileConditionInput | null,
};

export type UpdateBusinessProfileMutation = {
  updateBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteBusinessProfileMutationVariables = {
  input: DeleteBusinessProfileInput,
  condition?: ModelBusinessProfileConditionInput | null,
};

export type DeleteBusinessProfileMutation = {
  deleteBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type CreateReviewMutationVariables = {
  input: CreateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type CreateReviewMutation = {
  createReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type UpdateReviewMutationVariables = {
  input: UpdateReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type UpdateReviewMutation = {
  updateReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type DeleteReviewMutationVariables = {
  input: DeleteReviewInput,
  condition?: ModelReviewConditionInput | null,
};

export type DeleteReviewMutation = {
  deleteReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type CreateReviewCommentMutationVariables = {
  input: CreateReviewCommentInput,
  condition?: ModelReviewCommentConditionInput | null,
};

export type CreateReviewCommentMutation = {
  createReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type UpdateReviewCommentMutationVariables = {
  input: UpdateReviewCommentInput,
  condition?: ModelReviewCommentConditionInput | null,
};

export type UpdateReviewCommentMutation = {
  updateReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type DeleteReviewCommentMutationVariables = {
  input: DeleteReviewCommentInput,
  condition?: ModelReviewCommentConditionInput | null,
};

export type DeleteReviewCommentMutation = {
  deleteReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type GetUserRoleQueryVariables = {
  id: string,
};

export type GetUserRoleQuery = {
  getUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListUserRolesQueryVariables = {
  filter?: ModelUserRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserRolesQuery = {
  listUserRoles?:  {
    __typename: "ModelUserRoleConnection",
    items:  Array< {
      __typename: "UserRole",
      id: string,
      profileID: string,
      role: AppRole,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserRolesByProfileIDQueryVariables = {
  profileID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserRoleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserRolesByProfileIDQuery = {
  userRolesByProfileID?:  {
    __typename: "ModelUserRoleConnection",
    items:  Array< {
      __typename: "UserRole",
      id: string,
      profileID: string,
      role: AppRole,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProfileQueryVariables = {
  id: string,
};

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type ListProfilesQueryVariables = {
  filter?: ModelProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProfilesQuery = {
  listProfiles?:  {
    __typename: "ModelProfileConnection",
    items:  Array< {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetBusinessProfileQueryVariables = {
  id: string,
};

export type GetBusinessProfileQuery = {
  getBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListBusinessProfilesQueryVariables = {
  filter?: ModelBusinessProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBusinessProfilesQuery = {
  listBusinessProfiles?:  {
    __typename: "ModelBusinessProfileConnection",
    items:  Array< {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BusinessProfilesByCategoryQueryVariables = {
  category: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBusinessProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BusinessProfilesByCategoryQuery = {
  businessProfilesByCategory?:  {
    __typename: "ModelBusinessProfileConnection",
    items:  Array< {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type BusinessProfilesByAddressQueryVariables = {
  address: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelBusinessProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type BusinessProfilesByAddressQuery = {
  businessProfilesByAddress?:  {
    __typename: "ModelBusinessProfileConnection",
    items:  Array< {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetReviewQueryVariables = {
  id: string,
};

export type GetReviewQuery = {
  getReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type ListReviewsQueryVariables = {
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewsQuery = {
  listReviews?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ReviewsByUserIDQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ReviewsByUserIDQuery = {
  reviewsByUserID?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ReviewsByBusinessIDQueryVariables = {
  businessID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReviewFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ReviewsByBusinessIDQuery = {
  reviewsByBusinessID?:  {
    __typename: "ModelReviewConnection",
    items:  Array< {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetReviewCommentQueryVariables = {
  id: string,
};

export type GetReviewCommentQuery = {
  getReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type ListReviewCommentsQueryVariables = {
  filter?: ModelReviewCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListReviewCommentsQuery = {
  listReviewComments?:  {
    __typename: "ModelReviewCommentConnection",
    items:  Array< {
      __typename: "ReviewComment",
      id: string,
      reviewID: string,
      userID: string,
      comment: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ReviewCommentsByReviewIDQueryVariables = {
  reviewID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReviewCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ReviewCommentsByReviewIDQuery = {
  reviewCommentsByReviewID?:  {
    __typename: "ModelReviewCommentConnection",
    items:  Array< {
      __typename: "ReviewComment",
      id: string,
      reviewID: string,
      userID: string,
      comment: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ReviewCommentsByUserIDQueryVariables = {
  userID: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelReviewCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ReviewCommentsByUserIDQuery = {
  reviewCommentsByUserID?:  {
    __typename: "ModelReviewCommentConnection",
    items:  Array< {
      __typename: "ReviewComment",
      id: string,
      reviewID: string,
      userID: string,
      comment: string,
      createdAt?: string | null,
      updatedAt?: string | null,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserRoleSubscriptionVariables = {
  filter?: ModelSubscriptionUserRoleFilterInput | null,
  owner?: string | null,
};

export type OnCreateUserRoleSubscription = {
  onCreateUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateUserRoleSubscriptionVariables = {
  filter?: ModelSubscriptionUserRoleFilterInput | null,
  owner?: string | null,
};

export type OnUpdateUserRoleSubscription = {
  onUpdateUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteUserRoleSubscriptionVariables = {
  filter?: ModelSubscriptionUserRoleFilterInput | null,
  owner?: string | null,
};

export type OnDeleteUserRoleSubscription = {
  onDeleteUserRole?:  {
    __typename: "UserRole",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    role: AppRole,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateProfileSubscription = {
  onCreateProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateProfileSubscription = {
  onUpdateProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteProfileSubscriptionVariables = {
  filter?: ModelSubscriptionProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteProfileSubscription = {
  onDeleteProfile?:  {
    __typename: "Profile",
    id: string,
    full_name: string,
    avatar_url?: string | null,
    roles?:  {
      __typename: "ModelUserRoleConnection",
      nextToken?: string | null,
    } | null,
    businessProfile?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    reviewComments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
  } | null,
};

export type OnCreateBusinessProfileSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessProfileFilterInput | null,
  owner?: string | null,
};

export type OnCreateBusinessProfileSubscription = {
  onCreateBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateBusinessProfileSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessProfileFilterInput | null,
  owner?: string | null,
};

export type OnUpdateBusinessProfileSubscription = {
  onUpdateBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteBusinessProfileSubscriptionVariables = {
  filter?: ModelSubscriptionBusinessProfileFilterInput | null,
  owner?: string | null,
};

export type OnDeleteBusinessProfileSubscription = {
  onDeleteBusinessProfile?:  {
    __typename: "BusinessProfile",
    id: string,
    profileID: string,
    profile?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    business_name: string,
    category: string,
    description?: string | null,
    address?: string | null,
    phone?: string | null,
    website?: string | null,
    hours?: string | null,
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    logo_url?: string | null,
    reviews?:  {
      __typename: "ModelReviewConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnCreateReviewSubscription = {
  onCreateReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReviewSubscription = {
  onUpdateReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteReviewSubscriptionVariables = {
  filter?: ModelSubscriptionReviewFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReviewSubscription = {
  onDeleteReview?:  {
    __typename: "Review",
    id: string,
    rating: number,
    comment: string,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    businessID: string,
    business?:  {
      __typename: "BusinessProfile",
      id: string,
      profileID: string,
      business_name: string,
      category: string,
      description?: string | null,
      address?: string | null,
      phone?: string | null,
      website?: string | null,
      hours?: string | null,
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      logo_url?: string | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    review_name?: string | null,
    moderation_status: ModerationStatus,
    createdAt?: string | null,
    updatedAt?: string | null,
    editableUntil?: string | null,
    comments?:  {
      __typename: "ModelReviewCommentConnection",
      nextToken?: string | null,
    } | null,
    owner?: string | null,
  } | null,
};

export type OnCreateReviewCommentSubscriptionVariables = {
  filter?: ModelSubscriptionReviewCommentFilterInput | null,
  owner?: string | null,
};

export type OnCreateReviewCommentSubscription = {
  onCreateReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnUpdateReviewCommentSubscriptionVariables = {
  filter?: ModelSubscriptionReviewCommentFilterInput | null,
  owner?: string | null,
};

export type OnUpdateReviewCommentSubscription = {
  onUpdateReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};

export type OnDeleteReviewCommentSubscriptionVariables = {
  filter?: ModelSubscriptionReviewCommentFilterInput | null,
  owner?: string | null,
};

export type OnDeleteReviewCommentSubscription = {
  onDeleteReviewComment?:  {
    __typename: "ReviewComment",
    id: string,
    reviewID: string,
    review?:  {
      __typename: "Review",
      id: string,
      rating: number,
      comment: string,
      userID: string,
      businessID: string,
      review_name?: string | null,
      moderation_status: ModerationStatus,
      createdAt?: string | null,
      updatedAt?: string | null,
      editableUntil?: string | null,
      owner?: string | null,
    } | null,
    userID: string,
    user?:  {
      __typename: "Profile",
      id: string,
      full_name: string,
      avatar_url?: string | null,
      createdAt: string,
      updatedAt: string,
      profileBusinessProfileId?: string | null,
      owner?: string | null,
    } | null,
    comment: string,
    createdAt?: string | null,
    updatedAt?: string | null,
    owner?: string | null,
  } | null,
};
