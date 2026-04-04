import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchBusinessProfileHistoryForAdmin,
  fetchPendingBusinessProfilesForAdmin,
  setBusinessVerificationStatus,
  type BusinessProfileRow,
} from "@/integrations/amplify/businessProfiles";

export type BusinessProfileReview = BusinessProfileRow;

export type BusinessProfileHistoryEntry = {
  id: string;
  business_profile_id: string;
  changed_by: string | null;
  changed_at: string;
  action: "insert" | "update" | "delete" | string;
  previous_row: Record<string, unknown> | null;
  new_row: Record<string, unknown> | null;
};

const QUERY_KEY_PENDING = ["admin", "pending-businesses"];
const QUERY_KEY_HISTORY = ["admin", "business-history"];

export function usePendingBusinesses() {
  return useQuery({
    queryKey: QUERY_KEY_PENDING,
    queryFn: async (): Promise<BusinessProfileReview[]> => {
      return fetchPendingBusinessProfilesForAdmin();
    },
  });
}

export function useBusinessProfileHistory(businessId: string | null) {
  return useQuery({
    enabled: !!businessId,
    queryKey: [...QUERY_KEY_HISTORY, businessId],
    queryFn: async (): Promise<BusinessProfileHistoryEntry[]> => {
      return fetchBusinessProfileHistoryForAdmin(businessId!);
    },
  });
}

export function useApproveBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      await setBusinessVerificationStatus(businessId, "verified");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PENDING });
    },
  });
}

export function useRejectBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      await setBusinessVerificationStatus(businessId, "rejected");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_PENDING });
    },
  });
}
