import { describe, expect, it } from "vitest";
import { addBusinessSchema, editBusinessSchema } from "./businessFormSchema";

describe("addBusinessSchema (F4.1.5)", () => {
  it("requires verification attestation", () => {
    const result = addBusinessSchema.safeParse({
      business_name: "Test Cafe",
      category: "Food",
      description: "",
      address: "",
      phone: "",
      website: "",
      price_level: 2,
      languages: "English",
      is_minority_owned: true,
      is_howard_affiliated: false,
      logoFile: null,
      verification_attestation: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    const result = addBusinessSchema.safeParse({
      business_name: "Test Cafe",
      category: "Food",
      description: "",
      address: "",
      phone: "",
      website: "",
      price_level: 2,
      languages: "English",
      is_minority_owned: true,
      is_howard_affiliated: false,
      logoFile: null,
      verification_attestation: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid website when provided", () => {
    const result = addBusinessSchema.safeParse({
      business_name: "Test Cafe",
      category: "Food",
      description: "",
      address: "",
      phone: "",
      website: "not-a-url",
      price_level: 2,
      languages: "English",
      is_minority_owned: true,
      is_howard_affiliated: false,
      logoFile: null,
      verification_attestation: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("editBusinessSchema", () => {
  it("does not require verification attestation", () => {
    const result = editBusinessSchema.safeParse({
      business_name: "Test Cafe",
      category: "Food",
      description: "",
      address: "",
      phone: "",
      website: "https://example.com",
      price_level: 2,
      languages: "English",
      is_minority_owned: true,
      is_howard_affiliated: false,
      logoFile: null,
    });
    expect(result.success).toBe(true);
  });
});
