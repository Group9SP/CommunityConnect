/**
 * F5.1.1 Verification types and F5.1.10 badge visibility rules (pure functions — testable).
 */

export const VERIFICATION_TYPES = {
  MINORITY_OWNED: "minority_owned",
  HOWARD_AFFILIATED: "howard_affiliated",
} as const;

export type VerificationTypeCode =
  (typeof VERIFICATION_TYPES)[keyof typeof VERIFICATION_TYPES];

/** F5.1.2 Required documentation (human-readable; enforced in UI + upload helpers). */
export const REQUIRED_DOCUMENTATION: Record<VerificationTypeCode, string> = {
  minority_owned:
    "Government-issued ID or minority business certification (MBE, state certificate, or equivalent). PDF or image.",
  howard_affiliated:
    "Proof of Howard University affiliation: diploma, alumni ID, student/faculty verification, or official partnership letter. PDF or image.",
};

export const ALLOWED_VERIFICATION_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_VERIFICATION_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export type BusinessVerificationFields = {
  verification_status: string | null;
  is_minority_owned: boolean | null;
  is_howard_affiliated: boolean | null;
  minority_verified: boolean | null;
  howard_verified: boolean | null;
};

/**
 * F5.1.10 — Public minority-owned badge: listed as verified, owner claims minority, admin approved minority.
 */
export function showMinorityOwnedBadge(b: BusinessVerificationFields): boolean {
  return (
    b.verification_status === "verified" &&
    !!b.is_minority_owned &&
    !!b.minority_verified
  );
}

/**
 * F5.1.10 — Public Howard badge: listed as verified, owner claims Howard affiliation, admin approved Howard.
 */
export function showHowardAffiliatedBadge(b: BusinessVerificationFields): boolean {
  return (
    b.verification_status === "verified" &&
    !!b.is_howard_affiliated &&
    !!b.howard_verified
  );
}

/** Browse filter: “verified” checkbox = minority verification badge. */
export function passesVerifiedMinorityFilter(
  b: BusinessVerificationFields,
  filterOn: boolean
): boolean {
  if (!filterOn) return true;
  return showMinorityOwnedBadge(b);
}

/** Browse filter: Howard-affiliated. */
export function passesHowardFilter(
  b: BusinessVerificationFields,
  filterOn: boolean
): boolean {
  if (!filterOn) return true;
  return showHowardAffiliatedBadge(b);
}
