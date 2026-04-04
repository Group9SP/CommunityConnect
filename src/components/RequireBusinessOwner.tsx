import { ReactNode } from "react";
import { RequireRole } from "@/features/auth/components/RequireRole";

type RequireBusinessOwnerProps = {
  children: ReactNode;
};

export function RequireBusinessOwner({ children }: RequireBusinessOwnerProps) {
  return (
    <RequireRole
      role="business_owner"
      forbiddenTitle="Access restricted"
      forbiddenDescription="This area is for business owners only. Please sign in with a business owner account or contact support if you believe this is a mistake."
    >
      {children}
    </RequireRole>
  );
}

