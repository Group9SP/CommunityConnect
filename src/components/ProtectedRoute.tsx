import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * ProtectedRoute restricts access to children based on authentication and role.
 * Uses fetchAuthSession() to read the Cognito ID token payload (Amplify v6).
 * @param allowedRoles Array of allowed roles (e.g., ["business_owner"])
 */
export default function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const [role, setRole] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    fetchAuthSession()
      .then((session) => {
        const payload = session.tokens?.idToken?.payload;
        const userRole = (payload?.["custom:role"] as string) ?? null;
        setRole(userRole);
      })
      .catch(() => setRole(null));
  }, []);

  // Still loading
  if (role === undefined) return null;
  // Not authenticated
  if (role === null) return <Navigate to="/auth" replace />;
  // Wrong role
  if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
