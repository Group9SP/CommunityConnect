/**
 * Pure business logic — no image/asset imports.
 * Safe to import in Node.js (vitest) test environments.
 */

import type { BusinessFilters } from "@/types/business-filters";

// ---------------------------------------------------------------------------
// Business type
// ---------------------------------------------------------------------------

export interface Business {
    id: string;
    name: string;
    category: string;
    image: string;
    rating: number;
    reviewCount: number;
    priceLevel: number;
    languages: string[];
    location: string;
    isVerified: boolean;
    isHowardAffiliated: boolean;
    isMinorityOwned: boolean;
    description: string;
    /** ISO 8601 date string — used for "newest" sort */
    createdAt: string;
}

// ---------------------------------------------------------------------------
// Static seed data (no image asset imports — uses placeholder strings)
// ---------------------------------------------------------------------------

export const STATIC_BUSINESSES: Business[] = [
    {
        id: "1",
        name: "Elevation Coffee House",
        category: "Coffee & Tea",
        image: "/images/coffee.jpg",
        rating: 4.8,
        reviewCount: 124,
        priceLevel: 2,
        languages: ["EN", "ES"],
        location: "Washington, DC",
        isVerified: true,
        isHowardAffiliated: true,
        isMinorityOwned: true,
        description:
            "Premium coffee roasted daily with a mission to uplift the community. Howard alumni-owned since 2020.",
        createdAt: "2024-03-01T00:00:00Z",
    },
    {
        id: "2",
        name: "Soul & Flavor Bistro",
        category: "Restaurant",
        image: "/images/restaurant.jpg",
        rating: 4.9,
        reviewCount: 286,
        priceLevel: 3,
        languages: ["EN"],
        location: "Washington, DC",
        isVerified: true,
        isHowardAffiliated: false,
        isMinorityOwned: true,
        description:
            "Contemporary soul food restaurant celebrating Black culinary excellence with locally-sourced ingredients.",
        createdAt: "2024-01-15T00:00:00Z",
    },
    {
        id: "3",
        name: "Heritage Boutique",
        category: "Fashion & Retail",
        image: "/images/boutique.jpg",
        rating: 4.7,
        reviewCount: 92,
        priceLevel: 3,
        languages: ["EN", "FR"],
        location: "Washington, DC",
        isVerified: true,
        isHowardAffiliated: true,
        isMinorityOwned: true,
        description:
            "Curated fashion celebrating African diaspora designers. Founded by Howard University fashion alumna.",
        createdAt: "2024-02-10T00:00:00Z",
    },
    {
        id: "4",
        name: "Crown & Glory Salon",
        category: "Beauty & Wellness",
        image: "/images/salon.jpg",
        rating: 5.0,
        reviewCount: 156,
        priceLevel: 2,
        languages: ["EN"],
        location: "Washington, DC",
        isVerified: true,
        isHowardAffiliated: true,
        isMinorityOwned: true,
        description:
            "Full-service salon specializing in natural hair care and protective styling. Howard student-owned.",
        createdAt: "2024-04-20T00:00:00Z",
    },
];

// ---------------------------------------------------------------------------
// Pure helpers — exported for direct use in tests (F3.2.9–F3.2.11)
// ---------------------------------------------------------------------------

/**
 * F3.2.1, F3.2.9, F3.2.10
 * Filter businesses by all active filter criteria and the search query.
 * Searchable fields: name, category, location, description.
 */
export function applyFilters(
    businesses: Business[],
    filters: BusinessFilters,
    query: string
): Business[] {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
        if (filters.verified && !b.isVerified) return false;
        if (filters.howardAffiliated && !b.isHowardAffiliated) return false;
        if (filters.minorityOwned && !b.isMinorityOwned) return false;
        if (
            filters.categories.length > 0 &&
            !filters.categories.includes(b.category)
        )
            return false;
        if (b.priceLevel > filters.maxPriceLevel) return false;
        if (filters.minRating > 0 && b.rating < filters.minRating) return false;

        if (q) {
            // F3.2.1 — searchable: name, category, location, description
            const haystack =
                `${b.name} ${b.category} ${b.location} ${b.description}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }

        return true;
    });
}

/**
 * F3.2.3 — Sort a filtered list by the chosen strategy.
 */
export function applySort(
    businesses: Business[],
    sortBy: BusinessFilters["sortBy"]
): Business[] {
    const copy = [...businesses];
    switch (sortBy) {
        case "rating":
            return copy.sort((a, b) => b.rating - a.rating);
        case "mostReviewed":
            return copy.sort((a, b) => b.reviewCount - a.reviewCount);
        case "newest":
            return copy.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        default:
            return copy;
    }
}

/**
 * F3.2.8 — Slice a sorted+filtered list for the given page.
 */
export function applyPagination(
    businesses: Business[],
    page: number,
    pageSize: number
): { page: Business[]; totalCount: number } {
    const from = (page - 1) * pageSize;
    return {
        page: businesses.slice(from, from + pageSize),
        totalCount: businesses.length,
    };
}
