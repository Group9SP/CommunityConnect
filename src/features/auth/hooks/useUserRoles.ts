import { useQuery } from "@tanstack/react-query";
import { gqlClient } from "@/integrations/amplify/graphqlClient";
import { userRolesByProfileID } from "@/graphql/queries";

export type UserRole = "admin" | "business_owner" | "customer" | (string & {});

async function fetchUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const result = await gqlClient.graphql({
      query: userRolesByProfileID,
      variables: { profileID: userId },
    });
    const items = result.data?.userRolesByProfileID?.items ?? [];
    const roles = items.map((r: { role: string }) => r.role as UserRole);
    if (roles.length > 0) return roles;
  } catch (e) {
    console.warn("[useUserRoles] GraphQL failed, trying localStorage fallback:", e);
  }
  // Fallback: role stored locally at sign-up time
  const local = localStorage.getItem(`cc_role_${userId}`);
  if (local) return [local as UserRole];
  return [];
}

export function useUserRoles(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["auth", "user-roles", userId],
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
