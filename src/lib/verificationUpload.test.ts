import { describe, it, expect } from "vitest";
import { buildPrivateDocumentPath, validateVerificationFile } from "./verificationUpload";

describe("F5.1.5 / F5.1.8 private document paths", () => {
  it("buildPrivateDocumentPath prefixes with user id for RLS (first folder = owner)", () => {
    const file = new File(["x"], "proof.pdf", { type: "application/pdf" });
    const path = buildPrivateDocumentPath("user-abc-123", file);
    expect(path.startsWith("user-abc-123/")).toBe(true);
    expect(path).toContain("proof.pdf");
  });

  it("validateVerificationFile rejects oversize files", () => {
    const big = new File([new Uint8Array(11 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });
    expect(validateVerificationFile(big)).not.toBeNull();
  });

  it("validateVerificationFile accepts small pdf", () => {
    const ok = new File(["%PDF"], "ok.pdf", { type: "application/pdf" });
    expect(validateVerificationFile(ok)).toBeNull();
  });
});
