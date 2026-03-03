import { supabase } from "./client";

export type AddBusinessFormValues = {
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

export async function uploadBusinessImage(file: File, userId: string) {
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage.from("business-images").upload(path, file);

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from("business-images").getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

export async function createBusinessProfile(input: AddBusinessFormValues, userId: string) {
  let logoUrl: string | null = null;

  if (input.logoFile) {
    logoUrl = await uploadBusinessImage(input.logoFile, userId);
  }

  const payload = {
    user_id: userId,
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
    logo_url: logoUrl,
  };

  const { data, error } = await supabase.from("business_profiles").insert(payload).select("*").single();

  if (error) {
    throw error;
  }

  return data;
}

