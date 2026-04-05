import { useEffect, useState } from "react";
import { gqlClient } from "@/integrations/amplify/graphqlClient";
import { userRolesByProfileID } from "@/graphql/queries";

export type AppRole = "customer" | "business_owner" | "admin";

export function useUserRoles(userId: string | undefined) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    gqlClient.graphql({
      query: userRolesByProfileID,
      variables: { profileID: userId },
    })
      .then((result) => {
        if (cancelled) return;
        const items = result.data?.userRolesByProfileID?.items ?? [];
        const parsed = items.map((r: { role: string }) => r.role as AppRole);
        if (parsed.length === 0) {
          const local = localStorage.getItem(`cc_role_${userId}`);
          setRoles(local ? [local as AppRole] : []);
        } else {
          setRoles(parsed);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        const local = localStorage.getItem(`cc_role_${userId}`);
        setRoles(local ? [local as AppRole] : []);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [userId]);

  return {
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    isBusinessOwner: roles.includes("business_owner"),
  };
}
