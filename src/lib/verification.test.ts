import { describe, it, expect } from "vitest";
import {
  showHowardAffiliatedBadge,
  showMinorityOwnedBadge,
  passesHowardFilter,
  passesVerifiedMinorityFilter,
  type BusinessVerificationFields,
} from "./verification";

const base: BusinessVerificationFields = {
  verification_status: "verified",
  is_minority_owned: true,
  is_howard_affiliated: true,
  minority_verified: true,
  howard_verified: true,
};

describe("F5.1.10 badge visibility", () => {
  it("shows minority badge only when verified, claimed, and admin-approved", () => {
    expect(showMinorityOwnedBadge(base)).toBe(true);
    expect(
      showMinorityOwnedBadge({
        ...base,
        minority_verified: false,
      })
    ).toBe(false);
    expect(
      showMinorityOwnedBadge({
        ...base,
        is_minority_owned: false,
      })
    ).toBe(false);
    expect(
      showMinorityOwnedBadge({
        ...base,
        verification_status: "pending",
      })
    ).toBe(false);
  });

  it("shows Howard badge only when verified, claimed, and admin-approved", () => {
    expect(showHowardAffiliatedBadge(base)).toBe(true);
    expect(
      showHowardAffiliatedBadge({
        ...base,
        howard_verified: false,
      })
    ).toBe(false);
    expect(
      showHowardAffiliatedBadge({
        ...base,
        is_howard_affiliated: false,
      })
    ).toBe(false);
  });
});

describe("Browse filters", () => {
  it("passesVerifiedMinorityFilter respects checkbox", () => {
    expect(passesVerifiedMinorityFilter(base, false)).toBe(true);
    expect(passesVerifiedMinorityFilter(base, true)).toBe(true);
    expect(
      passesVerifiedMinorityFilter({ ...base, minority_verified: false }, true)
    ).toBe(false);
  });

  it("passesHowardFilter respects checkbox", () => {
    expect(passesHowardFilter(base, false)).toBe(true);
    expect(passesHowardFilter(base, true)).toBe(true);
    expect(
      passesHowardFilter({ ...base, howard_verified: false }, true)
    ).toBe(false);
  });
});

describe("F5.1.9 approval vs rejection semantics (UI rules)", () => {
  it("rejected overall listing does not show public badges", () => {
    const rejected: BusinessVerificationFields = {
      verification_status: "rejected",
      is_minority_owned: true,
      is_howard_affiliated: true,
      minority_verified: false,
      howard_verified: false,
    };
    expect(showMinorityOwnedBadge(rejected)).toBe(false);
    expect(showHowardAffiliatedBadge(rejected)).toBe(false);
  });
});
