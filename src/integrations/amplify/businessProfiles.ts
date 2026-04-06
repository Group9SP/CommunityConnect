import { gqlClient } from "./graphqlClient";
import { deleteBusinessProfile as gqlDelete } from "@/graphql/mutations";
import { getBusinessProfile, listBusinessProfiles } from "@/graphql/queries";
import { uploadBusinessImage } from "./storageUpload";
import { VerificationStatus } from "@/API";

// Minimal mutations — exclude nested `profile` object to avoid null errors
// when the Profile record doesn't exist for the user.
const createBusinessProfileMutation = /* GraphQL */ `
  mutation CreateBusinessProfile($input: CreateBusinessProfileInput!) {
    createBusinessProfile(input: $input) {
      id profileID business_name category description address phone website
      hours price_level languages is_minority_owned is_howard_affiliated
      verification_status logo_url createdAt updatedAt owner
    }
  }
`;

const updateBusinessProfileMutation = /* GraphQL */ `
  mutation UpdateBusinessProfile($input: UpdateBusinessProfileInput!) {
    updateBusinessProfile(input: $input) {
      id profileID business_name category description address phone website
      hours price_level languages is_minority_owned is_howard_affiliated
      verification_status logo_url createdAt updatedAt owner
    }
  }
`;

export type ListingVisibility = "draft" | "published";

export type BusinessProfileRow = {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  price_level: number;
  languages: string[] | null;
  is_minority_owned: boolean;
  is_howard_affiliated: boolean;
  verification_status: string;
  listing_visibility: ListingVisibility;
  deleted_at: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateBusinessProfileInput = {
  business_name: string;
  category: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  price_level: number;
  languages: string[];
  is_minority_owned: boolean;
  is_howard_affiliated: boolean;
  logoFile?: File | null;
};

export type UpdateBusinessProfileInput = Omit<CreateBusinessProfileInput, "logoFile"> & {
  logoFile?: File | null;
};

export class DuplicateBusinessProfileError extends Error {
  constructor() {
    super("You already have a business listing. Edit it from your dashboard instead.");
    this.name = "DuplicateBusinessProfileError";
  }
}

function mapItem(item: Record<string, unknown>): BusinessProfileRow {
  return {
    id: item.id as string,
    user_id: (item.profileID ?? item.owner ?? "") as string,
    business_name: item.business_name as string,
    category: item.category as string,
    description: (item.description as string | null) ?? null,
    address: (item.address as string | null) ?? null,
    phone: (item.phone as string | null) ?? null,
    website: (item.website as string | null) ?? null,
    hours: (item.hours as string | null) ?? null,
    price_level: (item.price_level as number) ?? 1,
    languages: (item.languages as string[] | null) ?? [],
    is_minority_owned: (item.is_minority_owned as boolean) ?? false,
    is_howard_affiliated: (item.is_howard_affiliated as boolean) ?? false,
    verification_status: (item.verification_status as string) ?? "pending",
    listing_visibility: "published",
    deleted_at: null,
    logo_url: (item.logo_url as string | null) ?? null,
    created_at: (item.createdAt as string) ?? "",
    updated_at: (item.updatedAt as string) ?? "",
  };
}

export async function getBusinessProfileForUser(userId: string): Promise<BusinessProfileRow | null> {
  const result = await gqlClient.graphql({
    query: listBusinessProfiles,
    variables: { filter: { profileID: { eq: userId } }, limit: 1 },
  });
  const items = result.data?.listBusinessProfiles?.items ?? [];
  if (items.length === 0) return null;
  return mapItem(items[0] as Record<string, unknown>);
}

export async function createBusinessProfile(
  input: CreateBusinessProfileInput,
  userId: string
): Promise<{ row: BusinessProfileRow; logoUploadFailed?: boolean }> {
  const existing = await getBusinessProfileForUser(userId);
  if (existing) throw new DuplicateBusinessProfileError();

  let logoUrl: string | null = null;
  let logoUploadFailed = false;

  if (input.logoFile) {
    try {
      logoUrl = await uploadBusinessImage(input.logoFile, userId);
    } catch {
      logoUploadFailed = true;
    }
  }

  const result = await gqlClient.graphql({
    query: createBusinessProfileMutation,
    variables: {
      input: {
        profileID: userId,
        business_name: input.business_name,
        category: input.category,
        description: input.description ?? null,
        address: input.address ?? null,
        phone: input.phone ?? null,
        website: input.website ?? null,
        hours: input.hours ?? null,
        price_level: input.price_level,
        languages: input.languages,
        is_minority_owned: input.is_minority_owned,
        is_howard_affiliated: input.is_howard_affiliated,
        verification_status: VerificationStatus.pending,
        ...(logoUrl ? { logo_url: logoUrl } : {}),
      },
    },
  });

  const row = mapItem(result.data?.createBusinessProfile as Record<string, unknown>);
  return { row, logoUploadFailed };
}

export async function updateBusinessProfile(
  businessId: string,
  userId: string,
  input: UpdateBusinessProfileInput
): Promise<{ row: BusinessProfileRow; logoUploadFailed?: boolean }> {
  let logoUrl: string | undefined;
  let logoUploadFailed = false;

  if (input.logoFile) {
    try {
      logoUrl = await uploadBusinessImage(input.logoFile, userId);
    } catch {
      logoUploadFailed = true;
    }
  }

  const result = await gqlClient.graphql({
    query: updateBusinessProfileMutation,
    variables: {
      input: {
        id: businessId,
        business_name: input.business_name,
        category: input.category,
        description: input.description ?? null,
        address: input.address ?? null,
        phone: input.phone ?? null,
        website: input.website ?? null,
        hours: input.hours ?? null,
        price_level: input.price_level,
        languages: input.languages,
        is_minority_owned: input.is_minority_owned,
        is_howard_affiliated: input.is_howard_affiliated,
        ...(logoUrl ? { logo_url: logoUrl } : {}),
      },
    },
  });

  const row = mapItem(result.data?.updateBusinessProfile as Record<string, unknown>);
  return { row, logoUploadFailed };
}

export async function fetchPublicBusinessListings(): Promise<BusinessProfileRow[]> {
  const result = await gqlClient.graphql({
    query: listBusinessProfiles,
    variables: {},
    authMode: "apiKey",
  });
  const items = result.data?.listBusinessProfiles?.items ?? [];
  return items.map((i) => mapItem(i as Record<string, unknown>));
}

export async function fetchBusinessProfileById(id: string): Promise<BusinessProfileRow | null> {
  const result = await gqlClient.graphql({
    query: getBusinessProfile,
    variables: { id },
    authMode: "apiKey",
  });
  const item = result.data?.getBusinessProfile;
  if (!item) return null;
  return mapItem(item as Record<string, unknown>);
}

export async function softDeleteBusinessProfile(businessId: string, _userId: string): Promise<BusinessProfileRow> {
  const result = await gqlClient.graphql({
    query: gqlDelete,
    variables: { input: { id: businessId } },
  });
  return mapItem(result.data?.deleteBusinessProfile as Record<string, unknown>);
}

export async function setListingVisibility(
  _businessId: string,
  _userId: string,
  _visibility: ListingVisibility
): Promise<BusinessProfileRow> {
  throw new Error("listing_visibility not in GraphQL schema.");
}

export async function setBusinessVerificationStatus(
  businessId: string,
  verification_status: "verified" | "rejected"
): Promise<void> {
  await gqlClient.graphql({
    query: updateBusinessProfileMutation,
    variables: { input: { id: businessId, verification_status: verification_status as VerificationStatus } },
  });
}

export async function countBusinessProfileHistory(_businessProfileId: string): Promise<number> {
  return 0;
}

export async function fetchPendingBusinessProfilesForAdmin(): Promise<BusinessProfileRow[]> {
  const result = await gqlClient.graphql({
    query: listBusinessProfiles,
    variables: { filter: { verification_status: { eq: "pending" } } },
  });
  const items = result.data?.listBusinessProfiles?.items ?? [];
  return items.map((i) => mapItem(i as Record<string, unknown>));
}

export async function fetchBusinessProfileHistoryForAdmin(_businessId: string) {
  return [];
}
