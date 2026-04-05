import { Navigate } from "react-router-dom";
import { useUserRoles } from "@/hooks/use-user-roles";
import { useSession } from "@/features/auth/hooks/useSession";

type Props = { children: React.ReactNode };

export function AdminRoute({ children }: Props) {
  const { session, loading: authLoading } = useSession();
  const userId = session?.user?.id;
  const { loading: rolesLoading, isAdmin } = useUserRoles(userId);

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
