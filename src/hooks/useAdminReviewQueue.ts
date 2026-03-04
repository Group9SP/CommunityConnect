import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Shape of business_profiles rows used in the admin review queue.
export type BusinessProfileReview = {
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
  created_at: string;
  updated_at: string;
  logo_url: string | null;
};

// Shape of a single audit entry from business_profile_history.
export type BusinessProfileHistoryEntry = {
  id: string;
  business_profile_id: string;
  changed_by: string | null;
  changed_at: string;
  action: "insert" | "update" | "delete" | string;
  previous_row: Record<string, unknown> | null;
  new_row: Record<string, unknown> | null;
};

// Shared React Query cache key for the list of pending businesses.
const QUERY_KEY_PENDING = ["admin", "pending-businesses"];
// Shared React Query cache key namespace for per-business history.
const QUERY_KEY_HISTORY = ["admin", "business-history"];

export function usePendingBusinesses() {
  return useQuery({
    queryKey: QUERY_KEY_PENDING,
    queryFn: async (): Promise<BusinessProfileReview[]> => {
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as BusinessProfileReview[];
    },
  });
}

// Fetch the edit history for a specific business profile so admins can audit changes over time.
export function useBusinessProfileHistory(businessId: string | null) {
  return useQuery({
    enabled: !!businessId,
    queryKey: [...QUERY_KEY_HISTORY, businessId],
    queryFn: async (): Promise<BusinessProfileHistoryEntry[]> => {
      const { data, error } = await supabase
        .from("business_profile_history")
        .select("*")
        .eq("business_profile_id", businessId)
        .order("changed_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as BusinessProfileHistoryEntry[];
    },
  });
}

export function useApproveBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    // Mark a business as verified so it becomes visible to regular users.
    mutationFn: async (businessId: string) => {
      const { error } = await supabase
        .from("business_profiles")
        .update({ verification_status: "verified" })
        .eq("id", businessId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PENDING });
    },
  });
}

export function useRejectBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    // Mark a business as rejected so admins know it was reviewed and declined.
    mutationFn: async (businessId: string) => {
      const { error } = await supabase
        .from("business_profiles")
        .update({ verification_status: "rejected" })
        .eq("id", businessId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PENDING });
    },
  });
}
