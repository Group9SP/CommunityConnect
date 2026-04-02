import { supabase } from "./client";

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

export async function getBusinessProfileForUser(userId: string): Promise<BusinessProfileRow | null> {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as BusinessProfileRow | null;
}

export async function uploadBusinessImage(file: File, userId: string): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage.from("business-images").upload(path, file, {
    upsert: false,
  });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from("business-images").getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

/**
 * Inserts the row first, then uploads the logo and patches the row (F4.1.7 / F4.1.9).
 * If upload fails, the listing still exists without a logo.
 */
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
  if (existing?.deleted_at) {
    const { data: updated, error: updateError } = await supabase
      .from("business_profiles")
      .update(basePayload)
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (updateError) throw updateError;
    row = updated as BusinessProfileRow;
  } else {
    const insertPayload = {
      ...basePayload,
      user_id: userId,
      logo_url: null as string | null,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("business_profiles")
      .insert(insertPayload)
      .select("*")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        throw new DuplicateBusinessProfileError();
      }
      throw insertError;
    }
    row = inserted as BusinessProfileRow;
  }

  let logoUploadFailed = false;

  if (input.logoFile) {
    try {
      const logoUrl = await uploadBusinessImage(input.logoFile, userId);
      const { data: updated, error: updateError } = await supabase
        .from("business_profiles")
        .update({ logo_url: logoUrl })
        .eq("id", row.id)
        .eq("user_id", userId)
        .select("*")
        .single();

      if (updateError) throw updateError;
      row = updated as BusinessProfileRow;
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

  const { data, error } = await supabase
    .from("business_profiles")
    .update(patch)
    .eq("id", businessId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return { row: data as BusinessProfileRow };
}

export async function setListingVisibility(
  businessId: string,
  userId: string,
  visibility: ListingVisibility
): Promise<BusinessProfileRow> {
  const { data, error } = await supabase
    .from("business_profiles")
    .update({ listing_visibility: visibility })
    .eq("id", businessId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data as BusinessProfileRow;
}

export async function softDeleteBusinessProfile(businessId: string, userId: string): Promise<BusinessProfileRow> {
  const { data, error } = await supabase
    .from("business_profiles")
    .update({ deleted_at: new Date().toISOString(), listing_visibility: "draft" })
    .eq("id", businessId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) throw error;
  return data as BusinessProfileRow;
}

export async function fetchPublicBusinessListings(): Promise<BusinessProfileRow[]> {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .order("business_name");

  if (error) throw error;
  return (data ?? []) as BusinessProfileRow[];
}

export async function fetchBusinessProfileById(id: string): Promise<BusinessProfileRow | null> {
  const { data, error } = await supabase.from("business_profiles").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return data as BusinessProfileRow | null;
}

export async function countBusinessProfileHistory(businessProfileId: string): Promise<number> {
  const { count, error } = await supabase
    .from("business_profile_history")
    .select("id", { count: "exact", head: true })
    .eq("business_profile_id", businessProfileId);

  if (error) throw error;
  return count ?? 0;
}
