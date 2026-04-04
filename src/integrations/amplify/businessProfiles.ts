import { RestApiError, restGetJson, restPatchJson, restPostJson } from "./restClient";
import { uploadBusinessImage } from "./storageUpload";

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

const pathPublicList = "/business_profiles/public";
const pathMine = "/business_profiles/me";
const pathBusiness = (id: string) => `/business_profiles/${id}`;
const pathHistoryCount = (id: string) => `/business_profiles/${id}/history/count`;
const pathAdminPending = "/business_profiles/admin/pending";
const pathHistory = (id: string) => `/business_profiles/${id}/history`;

export async function getBusinessProfileForUser(userId: string): Promise<BusinessProfileRow | null> {
  void userId;
  const data = await restGetJson<BusinessProfileRow>(pathMine);
  return data ?? null;
}

export async function createBusinessProfile(
  input: CreateBusinessProfileInput,
  userId: string
): Promise<{ row: BusinessProfileRow; logoUploadFailed?: boolean }> {
  const existing = await getBusinessProfileForUser(userId);
  if (existing && !existing.deleted_at) {
    throw new DuplicateBusinessProfileError();
  }

  const basePayload = {
    business_name: input.business_name,
    category: input.category,
    description: input.description ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    website: input.website ?? null,
    price_level: input.price_level,
    languages: input.languages,
    is_minority_owned: input.is_minority_owned,
    is_howard_affiliated: input.is_howard_affiliated,
    listing_visibility: "draft" as const,
    deleted_at: null as string | null,
  };

  let row: BusinessProfileRow;

  try {
    if (existing?.deleted_at) {
      const updated = await restPatchJson<BusinessProfileRow>(pathBusiness(existing.id), basePayload);
      if (!updated) throw new Error("Failed to restore business profile.");
      row = updated;
    } else {
      const inserted = await restPostJson<BusinessProfileRow>("/business_profiles", {
        ...basePayload,
        user_id: userId,
        logo_url: null as string | null,
      });
      if (!inserted) throw new Error("Failed to create business profile.");
      row = inserted;
    }
  } catch (e) {
    if (e instanceof RestApiError && e.statusCode === 409) {
      throw new DuplicateBusinessProfileError();
    }
    throw e;
  }

  let logoUploadFailed = false;

  if (input.logoFile) {
    try {
      const logoUrl = await uploadBusinessImage(input.logoFile, userId);
      const updated = await restPatchJson<BusinessProfileRow>(pathBusiness(row.id), { logo_url: logoUrl });
      if (!updated) throw new Error("Failed to update logo URL.");
      row = updated;
    } catch {
      logoUploadFailed = true;
    }
  }

  return { row, logoUploadFailed };
}

export async function updateBusinessProfile(
  businessId: string,
  userId: string,
  input: UpdateBusinessProfileInput
): Promise<{ row: BusinessProfileRow; logoUploadFailed?: boolean }> {
  void userId;

  let logoUrl: string | null | undefined;

  if (input.logoFile) {
    try {
      logoUrl = await uploadBusinessImage(input.logoFile, userId);
    } catch {
      return updateBusinessProfile(businessId, userId, { ...input, logoFile: null }).then((r) => ({
        ...r,
        logoUploadFailed: true,
      }));
    }
  }

  const patch: Record<string, unknown> = {
    business_name: input.business_name,
    category: input.category,
    description: input.description ?? null,
    address: input.address ?? null,
    phone: input.phone ?? null,
    website: input.website ?? null,
    price_level: input.price_level,
    languages: input.languages,
    is_minority_owned: input.is_minority_owned,
    is_howard_affiliated: input.is_howard_affiliated,
  };

  if (logoUrl !== undefined) {
    patch.logo_url = logoUrl;
  }

  const data = await restPatchJson<BusinessProfileRow>(pathBusiness(businessId), patch);
  if (!data) throw new Error("Failed to update business profile.");
  return { row: data };
}

export async function setListingVisibility(
  businessId: string,
  userId: string,
  visibility: ListingVisibility
): Promise<BusinessProfileRow> {
  void userId;
  const data = await restPatchJson<BusinessProfileRow>(pathBusiness(businessId), {
    listing_visibility: visibility,
  });
  if (!data) throw new Error("Failed to update listing visibility.");
  return data;
}

export async function softDeleteBusinessProfile(businessId: string, userId: string): Promise<BusinessProfileRow> {
  void userId;
  const data = await restPatchJson<BusinessProfileRow>(pathBusiness(businessId), {
    deleted_at: new Date().toISOString(),
    listing_visibility: "draft",
  });
  if (!data) throw new Error("Failed to delete business profile.");
  return data;
}

export async function fetchPublicBusinessListings(): Promise<BusinessProfileRow[]> {
  const data = await restGetJson<BusinessProfileRow[]>(pathPublicList, { public: true });
  return data ?? [];
}

export async function fetchBusinessProfileById(id: string): Promise<BusinessProfileRow | null> {
  const data = await restGetJson<BusinessProfileRow>(pathBusiness(id), { public: true });
  return data ?? null;
}

export async function countBusinessProfileHistory(businessProfileId: string): Promise<number> {
  const data = await restGetJson<{ count: number }>(pathHistoryCount(businessProfileId));
  return data?.count ?? 0;
}

export async function fetchPendingBusinessProfilesForAdmin(): Promise<BusinessProfileRow[]> {
  const data = await restGetJson<BusinessProfileRow[]>(pathAdminPending);
  return data ?? [];
}

export async function fetchBusinessProfileHistoryForAdmin(
  businessId: string
): Promise<
  {
    id: string;
    business_profile_id: string;
    changed_by: string | null;
    changed_at: string;
    action: string;
    previous_row: Record<string, unknown> | null;
    new_row: Record<string, unknown> | null;
  }[]
> {
  const data = await restGetJson<
    {
      id: string;
      business_profile_id: string;
      changed_by: string | null;
      changed_at: string;
      action: string;
      previous_row: Record<string, unknown> | null;
      new_row: Record<string, unknown> | null;
    }[]
  >(pathHistory(businessId));
  return data ?? [];
}

export async function setBusinessVerificationStatus(
  businessId: string,
  verification_status: "verified" | "rejected"
): Promise<void> {
  await restPatchJson(pathBusiness(businessId), { verification_status });
}
