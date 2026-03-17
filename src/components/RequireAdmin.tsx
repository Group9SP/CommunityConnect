import { ReactNode } from "react";
import { RequireRole } from "@/features/auth/components/RequireRole";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  return (
    <RequireRole
      role="admin"
      forbiddenTitle="Access restricted"
      forbiddenDescription="This area is for administrators only. If you believe you should have access, please contact support."
    >
      {children}
    </RequireRole>
  );
}
