import { useQuery } from "@tanstack/react-query";

import { restGetJson } from "@/integrations/amplify/restClient";

export type UserRole = "admin" | "business_owner" | "customer" | (string & {});

const QUERY_KEY = ["auth", "user-roles"];

async function fetchUserRoles(_userId: string): Promise<UserRole[]> {
  void _userId;
  const raw = await restGetJson<unknown>("/user_roles/me");
  if (Array.isArray(raw)) {
    return raw.map((r) => (r as { role: string }).role) as UserRole[];
  }
  if (raw && typeof raw === "object" && raw !== null && "roles" in raw) {
    return (raw as { roles: UserRole[] }).roles;
  }
  return [];
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
