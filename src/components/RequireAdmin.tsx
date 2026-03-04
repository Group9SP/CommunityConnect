import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  // Guard route so only users with the admin role can access wrapped content.
  const [status, setStatus] = useState<"loading" | "allowed" | "forbidden">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      // Look up the current auth session to decide if we should even attempt a role check.
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (!isMounted) return;

      if (error) {
        // If we cannot read roles, fail closed and block access.
        setStatus("forbidden");
        return;
      }

      const hasAdminRole = roles?.some((r) => r.role === "admin");

      setStatus(hasAdminRole ? "allowed" : "forbidden");
    };

    void checkAccess();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This area is for administrators only. If you believe you should have access, please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
