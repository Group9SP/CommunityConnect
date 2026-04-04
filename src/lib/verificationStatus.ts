// Central definition for business verification states so UI stays consistent.
export type VerificationStatus = "pending" | "verified" | "rejected";

// Human-readable labels for each status shown in badges and copy.
export function getVerificationStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case "pending":
      return "Pending review";
    case "verified":
      return "Verified";
    case "rejected":
      return "Rejected";
    default:
      // Fallback avoids hard-crashing if backend adds a new status before frontend updates.
      return status;
  }
}

// Short helper text describing what the current status means to admins/owners.
export function getVerificationStatusDescription(status: VerificationStatus): string {
  switch (status) {
    case "pending":
      return "Waiting for an admin to review this listing.";
    case "verified":
      return "This listing has been approved by an admin and is visible to customers.";
    case "rejected":
      return "This listing was reviewed and not approved; it is hidden from customers.";
    default:
      return "";
  }
}

