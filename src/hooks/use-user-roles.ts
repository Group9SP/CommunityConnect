import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setRoles([]);
        } else {
          setRoles((data ?? []).map((r) => r.role as AppRole));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isAdmin = roles.includes("admin");
  const isBusinessOwner = roles.includes("business_owner");

  return { roles, loading, isAdmin, isBusinessOwner };
}
