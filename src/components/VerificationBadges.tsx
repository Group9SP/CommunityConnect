import { Badge } from "@/components/ui/badge";
import {
  showHowardAffiliatedBadge,
  showMinorityOwnedBadge,
  type BusinessVerificationFields,
} from "@/lib/verification";

type Props = {
  business: BusinessVerificationFields;
  className?: string;
};

/** F5.1.7 — Uses centralized badge visibility rules. */
export function VerificationBadges({ business, className }: Props) {
  const minority = showMinorityOwnedBadge(business);
  const howard = showHowardAffiliatedBadge(business);

  if (!minority && !howard) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {minority && (
        <Badge className="bg-[hsl(var(--verified-badge))] text-white">✓ Verified Minority-Owned</Badge>
      )}
      {howard && (
        <Badge className="bg-accent text-accent-foreground">Howard Affiliated</Badge>
      )}
    </div>
  );
}
