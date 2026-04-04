import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/features/auth/hooks/useSession";
import { useHasRole, type UserRole } from "@/features/auth/hooks/useUserRoles";

type RequireRoleProps = {
  children: ReactNode;
  role: UserRole;
  forbiddenTitle?: string;
  forbiddenDescription?: string;
};

export function RequireRole({
  children,
  role,
  forbiddenTitle = "Access restricted",
  forbiddenDescription = "You do not have permission to view this page.",
}: RequireRoleProps) {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();
  const { hasRole, isLoading: rolesLoading, isError: rolesError } = useHasRole(session?.user.id, role);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) navigate("/auth", { replace: true });
  }, [navigate, session, sessionLoading]);

  if (sessionLoading || rolesLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (rolesError || !hasRole) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>{forbiddenTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{forbiddenDescription}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

