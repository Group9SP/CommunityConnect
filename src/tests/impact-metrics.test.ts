/**
 * F7.1.6 — Validate metric aggregation
 * F7.1.7 — Test analytics accuracy
 *
 * Run with: npm test
 */

import { describe, expect, it } from 'vitest';

// ---------------------------------------------------------------------------
// Pure aggregation logic extracted for unit testing
// (mirrors the logic in aggregator.ts without needing a live API)
// ---------------------------------------------------------------------------

interface BusinessStub {
  id: string;
  verification_status: string;
  is_howard_affiliated: boolean;
  is_minority_owned: boolean;
}

interface ReviewStub {
  id: string;
  businessID: string;
}

function computeMetrics(businesses: BusinessStub[], reviews: ReviewStub[]) {
  const totalBusinesses = businesses.length;
  const verifiedBusinesses = businesses.filter(
    (b) => b.verification_status === 'verified'
  ).length;
  const howardAffiliatedBusinesses = businesses.filter(
    (b) => b.is_howard_affiliated
  ).length;
  const minorityOwnedBusinesses = businesses.filter(
    (b) => b.is_minority_owned
  ).length;
  const totalReviews = reviews.length;

  const economicEmpowermentScore =
    totalBusinesses > 0
      ? Math.round(
          ((verifiedBusinesses + howardAffiliatedBusinesses) /
            (totalBusinesses * 2)) *
            100
        )
      : 0;

  const businessesWithReviews = new Set(
    reviews.map((r) => r.businessID).filter(Boolean)
  ).size;
  const communityReach = totalBusinesses + businessesWithReviews;

  return {
    totalBusinesses,
    verifiedBusinesses,
    howardAffiliatedBusinesses,
    minorityOwnedBusinesses,
    totalReviews,
    economicEmpowermentScore,
    communityReach,
  };
}

// ---------------------------------------------------------------------------
// F7.1.6 — Validate metric aggregation
// ---------------------------------------------------------------------------

describe('F7.1.6 — computeMetrics: metric aggregation', () => {
  const businesses: BusinessStub[] = [
    { id: '1', verification_status: 'verified', is_howard_affiliated: true, is_minority_owned: true },
    { id: '2', verification_status: 'verified', is_howard_affiliated: false, is_minority_owned: true },
    { id: '3', verification_status: 'pending', is_howard_affiliated: true, is_minority_owned: false },
    { id: '4', verification_status: 'pending', is_howard_affiliated: false, is_minority_owned: true },
  ];

  const reviews: ReviewStub[] = [
    { id: 'r1', businessID: '1' },
    { id: 'r2', businessID: '1' },
    { id: 'r3', businessID: '2' },
  ];

  it('counts total businesses correctly', () => {
    const { totalBusinesses } = computeMetrics(businesses, reviews);
    expect(totalBusinesses).toBe(4);
  });

  it('counts verified businesses correctly', () => {
    const { verifiedBusinesses } = computeMetrics(businesses, reviews);
    expect(verifiedBusinesses).toBe(2);
  });

  it('counts howard-affiliated businesses correctly', () => {
    const { howardAffiliatedBusinesses } = computeMetrics(businesses, reviews);
    expect(howardAffiliatedBusinesses).toBe(2);
  });

  it('counts minority-owned businesses correctly', () => {
    const { minorityOwnedBusinesses } = computeMetrics(businesses, reviews);
    expect(minorityOwnedBusinesses).toBe(3);
  });

  it('counts total reviews correctly', () => {
    const { totalReviews } = computeMetrics(businesses, reviews);
    expect(totalReviews).toBe(3);
  });

  it('returns 0 empowerment score when no businesses exist', () => {
    const { economicEmpowermentScore } = computeMetrics([], []);
    expect(economicEmpowermentScore).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// F7.1.7 — Test analytics accuracy
// ---------------------------------------------------------------------------

describe('F7.1.7 — computeMetrics: analytics accuracy', () => {
  it('calculates 100% empowerment score when all businesses are verified and howard-affiliated', () => {
    const perfect: BusinessStub[] = [
      { id: '1', verification_status: 'verified', is_howard_affiliated: true, is_minority_owned: true },
      { id: '2', verification_status: 'verified', is_howard_affiliated: true, is_minority_owned: true },
    ];
    const { economicEmpowermentScore } = computeMetrics(perfect, []);
    expect(economicEmpowermentScore).toBe(100);
  });

  it('community reach counts unique businesses with reviews, not total reviews', () => {
    const biz: BusinessStub[] = [
      { id: '1', verification_status: 'verified', is_howard_affiliated: false, is_minority_owned: true },
      { id: '2', verification_status: 'pending', is_howard_affiliated: false, is_minority_owned: false },
    ];
    // 3 reviews but only 1 unique business reviewed
    const rev: ReviewStub[] = [
      { id: 'r1', businessID: '1' },
      { id: 'r2', businessID: '1' },
      { id: 'r3', businessID: '1' },
    ];
    const { communityReach } = computeMetrics(biz, rev);
    // 2 total businesses + 1 unique business with reviews = 3
    expect(communityReach).toBe(3);
  });

  it('empowerment score is between 0 and 100', () => {
    const mixed: BusinessStub[] = [
      { id: '1', verification_status: 'verified', is_howard_affiliated: false, is_minority_owned: true },
      { id: '2', verification_status: 'pending', is_howard_affiliated: true, is_minority_owned: false },
      { id: '3', verification_status: 'pending', is_howard_affiliated: false, is_minority_owned: false },
    ];
    const { economicEmpowermentScore } = computeMetrics(mixed, []);
    expect(economicEmpowermentScore).toBeGreaterThanOrEqual(0);
    expect(economicEmpowermentScore).toBeLessThanOrEqual(100);
  });
});
