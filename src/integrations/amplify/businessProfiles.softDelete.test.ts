import { describe, expect, it, vi } from "vitest";

vi.mock("./restClient", () => ({
  RestApiError: class extends Error {
    statusCode: number;
    constructor(m: string, c: number) {
      super(m);
      this.statusCode = c;
    }
  },
  restGetJson: vi.fn(),
  restPostJson: vi.fn(),
  restPatchJson: vi.fn((path: string, payload: Record<string, unknown>) => {
    expect(payload).toMatchObject({
      listing_visibility: "draft",
    });
    expect(payload.deleted_at).toEqual(expect.any(String));
    return Promise.resolve({
      id: "biz-1",
      user_id: "user-1",
      deleted_at: payload.deleted_at,
      listing_visibility: "draft",
    });
  }),
}));

import { softDeleteBusinessProfile } from "./businessProfiles";

describe("softDeleteBusinessProfile (F4.2.6)", () => {
  it("updates deleted_at and draft visibility instead of deleting the row", async () => {
    const row = await softDeleteBusinessProfile("biz-1", "user-1");
    expect(row.deleted_at).toBeTruthy();
    expect(row.listing_visibility).toBe("draft");
  });
});
