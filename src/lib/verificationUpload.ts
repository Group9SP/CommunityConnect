import { ALLOWED_VERIFICATION_MIME_TYPES, MAX_VERIFICATION_FILE_BYTES } from "@/lib/verification";

const BUCKET = "verification-documents";

export function validateVerificationFile(file: File): string | null {
  if (file.size > MAX_VERIFICATION_FILE_BYTES) {
    return `File must be ${MAX_VERIFICATION_FILE_BYTES / 1024 / 1024} MB or smaller.`;
  }
  if (!ALLOWED_VERIFICATION_MIME_TYPES.includes(file.type as (typeof ALLOWED_VERIFICATION_MIME_TYPES)[number])) {
    return "Allowed types: PDF, JPEG, PNG, or WebP.";
  }
  return null;
}

/** F5.1.5 — Private bucket path: first segment must be auth user id (RLS). */
export function buildPrivateDocumentPath(userId: string, file: File): string {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  return `${userId}/${crypto.randomUUID()}_${safeName}`;
}

export const verificationBucket = BUCKET;
