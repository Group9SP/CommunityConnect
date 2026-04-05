/**
 * F3.2.9  — Test partial match search
 * F3.2.10 — Test combined filters
 * F3.2.11 — Test performance under large dataset
 *
 * Run with: npm test
 */

import { describe, expect, it } from "vitest";
import {
    applyFilters,
    applySort,
    applyPagination,
    STATIC_BUSINESSES,
    type Business,
} from "@/lib/businessLogic";
import { DEFAULT_FILTERS } from "@/types/business-filters";

// ---------------------------------------------------------------------------
// F3.2.9 — Partial match search
// ---------------------------------------------------------------------------

describe("F3.2.9 — applyFilters: partial match search", () => {
    it("matches business by partial name (case-insensitive)", () => {
        const results = applyFilters(STATIC_BUSINESSES, DEFAULT_FILTERS, "ele");
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toMatch(/elevation/i);
    });

    it("matches business by partial category", () => {
        const results = applyFilters(STATIC_BUSINESSES, DEFAULT_FILTERS, "coffee");
        expect(results.every((b) => b.category.toLowerCase().includes("coffee"))).toBe(true);
    });

    it("matches business by partial location (F3.2.1 — location is searchable)", () => {
        const results = applyFilters(STATIC_BUSINESSES, DEFAULT_FILTERS, "washington");
        // All 4 seed businesses are in Washington, DC
        expect(results.length).toBe(STATIC_BUSINESSES.length);
    });

    it("returns empty array when no businesses match", () => {
        const results = applyFilters(STATIC_BUSINESSES, DEFAULT_FILTERS, "zzznomatch999");
        expect(results).toHaveLength(0);
    });

    it("matches business by partial description", () => {
        const results = applyFilters(STATIC_BUSINESSES, DEFAULT_FILTERS, "soul food");
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toMatch(/soul/i);
    });
});

// ---------------------------------------------------------------------------
// F3.2.10 — Combined filters
// ---------------------------------------------------------------------------

describe("F3.2.10 — applyFilters: combined filters", () => {
    it("howardAffiliated + search query narrows to correct business", () => {
        const results = applyFilters(
            STATIC_BUSINESSES,
            { ...DEFAULT_FILTERS, howardAffiliated: true },
            "coffee"
        );
        expect(results).toHaveLength(1);
        expect(results[0].name).toMatch(/elevation/i);
    });

    it("verified + minRating:5 returns only perfect-rated verified businesses", () => {
        const results = applyFilters(
            STATIC_BUSINESSES,
            { ...DEFAULT_FILTERS, verified: true, minRating: 5 },
            ""
        );
        // Only Crown & Glory Salon has rating === 5.0
        expect(results).toHaveLength(1);
        expect(results[0].name).toMatch(/crown/i);
    });

    it("minorityOwned filter keeps minority-owned businesses", () => {
        const results = applyFilters(
            STATIC_BUSINESSES,
            { ...DEFAULT_FILTERS, minorityOwned: true },
            ""
        );
        expect(results.every((b) => b.isMinorityOwned)).toBe(true);
    });

    it("category filter combined with howardAffiliated", () => {
        const results = applyFilters(
            STATIC_BUSINESSES,
            { ...DEFAULT_FILTERS, categories: ["Beauty & Wellness"], howardAffiliated: true },
            ""
        );
        expect(results).toHaveLength(1);
        expect(results[0].name).toMatch(/crown/i);
    });

    it("maxPriceLevel:2 filters out priceLevel 3+ businesses", () => {
        const results = applyFilters(
            STATIC_BUSINESSES,
            { ...DEFAULT_FILTERS, maxPriceLevel: 2 },
            ""
        );
        expect(results.every((b) => b.priceLevel <= 2)).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// applySort tests
// ---------------------------------------------------------------------------

describe("applySort", () => {
    it("sorts by rating descending", () => {
        const sorted = applySort(STATIC_BUSINESSES, "rating");
        for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i + 1].rating);
        }
    });

    it("sorts by mostReviewed descending", () => {
        const sorted = applySort(STATIC_BUSINESSES, "mostReviewed");
        for (let i = 0; i < sorted.length - 1; i++) {
            expect(sorted[i].reviewCount).toBeGreaterThanOrEqual(sorted[i + 1].reviewCount);
        }
    });

    it("sorts by newest descending", () => {
        const sorted = applySort(STATIC_BUSINESSES, "newest");
        for (let i = 0; i < sorted.length - 1; i++) {
            const a = new Date(sorted[i].createdAt).getTime();
            const b = new Date(sorted[i + 1].createdAt).getTime();
            expect(a).toBeGreaterThanOrEqual(b);
        }
    });
});

// ---------------------------------------------------------------------------
// applyPagination tests
// ---------------------------------------------------------------------------

describe("applyPagination", () => {
    const items: Business[] = Array.from({ length: 15 }, (_, i) => ({
        ...STATIC_BUSINESSES[0],
        id: String(i),
    }));

    it("returns correct page slice", () => {
        const { page } = applyPagination(items, 2, 6);
        expect(page).toHaveLength(6);
    });

    it("returns correct totalCount", () => {
        const { totalCount } = applyPagination(items, 1, 6);
        expect(totalCount).toBe(15);
    });

    it("last page returns remaining items", () => {
        const { page } = applyPagination(items, 3, 6);
        expect(page).toHaveLength(3); // 15 - 12 = 3 remaining
    });
});

// ---------------------------------------------------------------------------
// F3.2.11 — Performance under large dataset
// ---------------------------------------------------------------------------

describe("F3.2.11 — applyFilters: performance under large dataset", () => {
    const LARGE_SIZE = 5_000;

    /** Generate synthetic businesses that partially match realistic data. */
    function generateLargeDataset(count: number): Business[] {
        return Array.from({ length: count }, (_, i) => ({
            ...STATIC_BUSINESSES[i % STATIC_BUSINESSES.length],
            id: String(i),
            name: `Business ${i}`,
            location: i % 3 === 0 ? "Washington, DC" : "Baltimore, MD",
            rating: 3 + (i % 3) * 0.5,        // 3.0 | 3.5 | 4.0
            reviewCount: (i % 100) + 1,
            isHowardAffiliated: i % 2 === 0,
            isMinorityOwned: true,
            createdAt: new Date(2024, i % 12, (i % 28) + 1).toISOString(),
        }));
    }

    it(`filters ${LARGE_SIZE} businesses in under 100 ms`, () => {
        const dataset = generateLargeDataset(LARGE_SIZE);
        const start = performance.now();

        applyFilters(
            dataset,
            { ...DEFAULT_FILTERS, howardAffiliated: true, minRating: 4 },
            "business"
        );

        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(100);
    });

    it(`sorts ${LARGE_SIZE} businesses in under 50 ms`, () => {
        const dataset = generateLargeDataset(LARGE_SIZE);
        const start = performance.now();
        applySort(dataset, "mostReviewed");
        const elapsed = performance.now() - start;
        expect(elapsed).toBeLessThan(50);
    });
});
