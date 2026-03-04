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
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export enum VerificationStatus {
  pending = "pending",
  verified = "verified",
  rejected = "rejected",
}


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
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
};

export type ModelBusinessProfileConditionInput = {
  profileID?: ModelIDInput | null,
  business_name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  description?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  price_level?: ModelIntInput | null,
  languages?: ModelStringInput | null,
  is_minority_owned?: ModelBooleanInput | null,
  is_howard_affiliated?: ModelBooleanInput | null,
  verification_status?: ModelVerificationStatusInput | null,
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
  price_level?: number | null,
  languages?: Array< string | null > | null,
  is_minority_owned?: boolean | null,
  is_howard_affiliated?: boolean | null,
  verification_status?: VerificationStatus | null,
};

export type DeleteBusinessProfileInput = {
  id: string,
};

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


export type ModelBusinessProfileFilterInput = {
  id?: ModelIDInput | null,
  profileID?: ModelIDInput | null,
  business_name?: ModelStringInput | null,
  category?: ModelStringInput | null,
  description?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  website?: ModelStringInput | null,
  price_level?: ModelIntInput | null,
  languages?: ModelStringInput | null,
  is_minority_owned?: ModelBooleanInput | null,
  is_howard_affiliated?: ModelBooleanInput | null,
  verification_status?: ModelVerificationStatusInput | null,
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

export type ModelSubscriptionBusinessProfileFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  profileID?: ModelSubscriptionIDInput | null,
  business_name?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  website?: ModelSubscriptionStringInput | null,
  price_level?: ModelSubscriptionIntInput | null,
  languages?: ModelSubscriptionStringInput | null,
  is_minority_owned?: ModelSubscriptionBooleanInput | null,
  is_howard_affiliated?: ModelSubscriptionBooleanInput | null,
  verification_status?: ModelSubscriptionStringInput | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
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
      price_level?: number | null,
      languages?: Array< string | null > | null,
      is_minority_owned?: boolean | null,
      is_howard_affiliated?: boolean | null,
      verification_status?: VerificationStatus | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    profileBusinessProfileId?: string | null,
    owner?: string | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
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
    price_level?: number | null,
    languages?: Array< string | null > | null,
    is_minority_owned?: boolean | null,
    is_howard_affiliated?: boolean | null,
    verification_status?: VerificationStatus | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
