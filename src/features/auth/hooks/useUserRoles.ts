import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "business_owner" | "customer" | (string & {});

const QUERY_KEY = ["auth", "user-roles"];

async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.role as UserRole);
}

export function useUserRoles(userId: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, userId],
    enabled: !!userId,
    queryFn: () => fetchUserRoles(userId!),
    staleTime: 30_000,
  });
}

export function useHasRole(userId: string | null | undefined, role: UserRole) {
  const query = useUserRoles(userId);
  return {
    ...query,
    hasRole: query.data?.includes(role) ?? false,
  };
}

