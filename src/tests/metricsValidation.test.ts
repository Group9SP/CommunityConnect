// src/tests/metricsValidation.test.ts

import { describe, it, expect } from 'vitest';
import { aggregateImpactKPIs, EngagementEvent } from "../lib/metrics";

// src/tests/metricsValidation.test.ts
// Simple test utility to validate dashboard metric aggregation

describe("Impact Metrics Aggregation", () => {
  it("should match event counts with aggregated KPIs", () => {
    // Example event data
    const events: EngagementEvent[] = [
      { businessID: "b1", userID: "u1", type: "profile_view" },
      { businessID: "b1", userID: "u2", type: "profile_view" },
      { businessID: "b1", userID: "u1", type: "website_click" },
      { businessID: "b2", userID: "u3", type: "profile_view" },
      { businessID: "b2", userID: "u3", type: "profile_view" },
      { businessID: "b2", userID: "u3", type: "website_click" },
    ];
    const reviews = [
      { rating: 5, businessID: "b1", userID: "u1" },
      { rating: 4, businessID: "b2", userID: "u3" },
    ];
    const verifiedBusinessIds = ["b1", "b2"];

    const kpis = aggregateImpactKPIs(events, reviews, verifiedBusinessIds);

    expect(kpis.totalProfileViews).toBe(4);
    expect(kpis.totalWebsiteClicks).toBe(2);
    expect(kpis.totalReviews).toBe(2);
    expect(kpis.averageReviewRating).toBe(4.5);
    expect(kpis.verifiedBusinesses).toBe(2);
    expect(kpis.repeatVisitors).toBe(1); // u3 viewed b2 twice
    expect(kpis.uniqueUsers).toBe(3);
    expect(kpis.businessesWithIncreasedEngagement).toBe(0); // none > 10 events
  });
});
