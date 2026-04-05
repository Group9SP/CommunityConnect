import { describe, expect, it, vi, beforeEach } from "vitest";

const mockState = vi.hoisted(() => ({
  existingProfile: null as { id: string; deleted_at: string | null } | null,
  uploadShouldFail: false,
  insertedRow: {
    id: "new-id",
    user_id: "user-1",
    business_name: "Cafe",
    category: "Food",
    description: null,
    address: null,
    phone: null,
    website: null,
    price_level: 2,
    languages: ["English"],
    is_minority_owned: true,
    is_howard_affiliated: false,
    verification_status: "pending",
    listing_visibility: "draft",
    deleted_at: null,
    logo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}));

vi.mock("./restClient", () => ({
  RestApiError: class RestApiError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = "RestApiError";
      this.statusCode = statusCode;
    }
  },
  restGetJson: vi.fn(async () => mockState.existingProfile),
  restPostJson: vi.fn(async () => mockState.insertedRow),
  restPatchJson: vi.fn(async () => ({
    ...mockState.insertedRow,
    logo_url: "https://cdn.example/logo.png",
  })),
}));

vi.mock("./storageUpload", () => ({
  uploadBusinessImage: vi.fn(async () => {
    if (mockState.uploadShouldFail) {
      throw new Error("storage unavailable");
    }
    return "https://cdn.example/logo.png";
  }),
}));

import { restGetJson, RestApiError } from "./restClient";
import { createBusinessProfile, DuplicateBusinessProfileError } from "./businessProfiles";

describe("createBusinessProfile (F4.1.9 duplicate + upload recovery)", () => {
  beforeEach(() => {
    mockState.existingProfile = null;
    mockState.uploadShouldFail = false;
    vi.mocked(restGetJson).mockImplementation(async () => mockState.existingProfile);
  });

  it("throws DuplicateBusinessProfileError when an active listing exists (F4.1.10)", async () => {
    mockState.existingProfile = { id: "existing", deleted_at: null };
    await expect(
      createBusinessProfile(
        {
          business_name: "A",
          category: "B",
          price_level: 2,
          languages: ["English"],
          is_minority_owned: true,
          is_howard_affiliated: false,
        },
        "user-1"
      )
    ).rejects.toBeInstanceOf(DuplicateBusinessProfileError);
  });

  it("returns the row with logoUploadFailed when storage upload fails after insert (F4.1.9)", async () => {
    mockState.uploadShouldFail = true;
    const file = new File([""], "logo.png", { type: "image/png" });
    const result = await createBusinessProfile(
      {
        business_name: "A",
        category: "B",
        price_level: 2,
        languages: ["English"],
        is_minority_owned: true,
        is_howard_affiliated: false,
        logoFile: file,
      },
      "user-1"
    );
    expect(result.row.id).toBe("new-id");
    expect(result.logoUploadFailed).toBe(true);
  });

  it("maps REST 409 to DuplicateBusinessProfileError", async () => {
    const { restPostJson } = await import("./restClient");
    vi.mocked(restGetJson).mockResolvedValueOnce(null);
    vi.mocked(restPostJson).mockRejectedValueOnce(new RestApiError("conflict", 409));
    await expect(
      createBusinessProfile(
        {
          business_name: "A",
          category: "B",
          price_level: 2,
          languages: ["English"],
          is_minority_owned: true,
          is_howard_affiliated: false,
        },
        "user-1"
      )
    ).rejects.toBeInstanceOf(DuplicateBusinessProfileError);
  });
});
