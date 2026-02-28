import coffeeImage from "@/assets/business-coffee.jpg";
import restaurantImage from "@/assets/business-restaurant.jpg";
import boutiqueImage from "@/assets/business-boutique.jpg";
import salonImage from "@/assets/business-salon.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { BusinessFilters } from "@/types/business-filters";
import {
    applyFilters,
    applySort,
    applyPagination,
    STATIC_BUSINESSES as STATIC_SEED,
    type Business,
} from "@/lib/businessLogic";
import { useQuery } from "@tanstack/react-query";

// Re-export types and pure helpers so consumers can import from one place
export type { Business };
export { applyFilters, applySort, applyPagination, STATIC_BUSINESSES } from "@/lib/businessLogic";

// ---------------------------------------------------------------------------
// Overlay actual asset images onto the static seed data so the UI shows
// real imported images while tests use the plain string paths.
// ---------------------------------------------------------------------------

const STATIC_BUSINESSES_WITH_IMAGES = STATIC_SEED.map((b, i) => ({
    ...b,
    image: [coffeeImage, restaurantImage, boutiqueImage, salonImage][i] ?? b.image,
}));

// ---------------------------------------------------------------------------
// Hook parameters & return type
// ---------------------------------------------------------------------------

export interface UseBusinessSearchParams {
    /** Already-debounced search string from Browse.tsx */
    query: string;
    filters: BusinessFilters;
    /** 1-based page index */
    page: number;
    /** Number of results per page */
    pageSize?: number;
}

export interface UseBusinessSearchResult {
    businesses: Business[];
    totalCount: number;
    isLoading: boolean;
    error: Error | null;
}

// ---------------------------------------------------------------------------
// Main async fetcher — tries Supabase, falls back to static data
// ---------------------------------------------------------------------------

async function fetchBusinesses({
    query,
    filters,
    page,
    pageSize,
}: Required<UseBusinessSearchParams>): Promise<{
    businesses: Business[];
    totalCount: number;
}> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
        // Build Supabase query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dbQuery = (supabase as any)
            .from("business_profiles")
            .select("*", { count: "exact" });

        // F3.2.1 — search across name, category, location, description
        if (query.trim()) {
            dbQuery = dbQuery.or(
                `business_name.ilike.%${query}%,category.ilike.%${query}%,address.ilike.%${query}%,description.ilike.%${query}%`
            );
        }

        // F3.2.2 — filter chips
        if (filters.verified) dbQuery = dbQuery.eq("verification_status", "verified");
        if (filters.howardAffiliated)
            dbQuery = dbQuery.eq("is_howard_affiliated", true);
        if (filters.minorityOwned)
            dbQuery = dbQuery.eq("is_minority_owned", true);

        // Category filter
        if (filters.categories.length > 0) {
            dbQuery = dbQuery.in("category", filters.categories);
        }

        // Price + rating
        if (filters.maxPriceLevel < 4)
            dbQuery = dbQuery.lte("price_level", filters.maxPriceLevel);
        if (filters.minRating > 0)
            dbQuery = dbQuery.gte("rating", filters.minRating);

        // F3.2.3 — sorting
        switch (filters.sortBy) {
            case "rating":
                dbQuery = dbQuery.order("rating", { ascending: false });
                break;
            case "mostReviewed":
                dbQuery = dbQuery.order("review_count", { ascending: false });
                break;
            case "newest":
                dbQuery = dbQuery.order("created_at", { ascending: false });
                break;
            default:
                dbQuery = dbQuery.order("rating", { ascending: false });
        }

        // F3.2.8 — pagination
        dbQuery = dbQuery.range(from, to);

        const { data, error, count } = await dbQuery;

        if (error) throw error;

        // Map snake_case DB columns → camelCase Business shape
        const businesses: Business[] = (data ?? []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (row: any): Business => ({
                id: String(row.id),
                name: row.business_name ?? "",
                category: row.category ?? "",
                image: row.image_url ?? coffeeImage,
                rating: row.rating ?? 0,
                reviewCount: row.review_count ?? 0,
                priceLevel: row.price_level ?? 1,
                languages: row.languages ?? [],
                location: row.address ?? "",
                isVerified: row.verification_status === "verified",
                isHowardAffiliated: row.is_howard_affiliated ?? false,
                isMinorityOwned: row.is_minority_owned ?? false,
                description: row.description ?? "",
                createdAt: row.created_at ?? new Date().toISOString(),
            })
        );

        return { businesses, totalCount: count ?? 0 };
    } catch (err) {
        console.error("Supabase fetch error:", err);
        // ── Graceful fallback: Supabase table not provisioned yet ──
        const filtered = applyFilters(STATIC_BUSINESSES_WITH_IMAGES, filters, query);
        const sorted = applySort(filtered, filters.sortBy);
        const { page: pageItems, totalCount } = applyPagination(
            sorted,
            page,
            pageSize
        );
        return { businesses: pageItems, totalCount };
    }
}

// ---------------------------------------------------------------------------
// Exported hook
// ---------------------------------------------------------------------------

const DEFAULT_PAGE_SIZE = 6;

export function useBusinessSearch({
    query,
    filters,
    page,
    pageSize = DEFAULT_PAGE_SIZE,
}: UseBusinessSearchParams): UseBusinessSearchResult {
    const { data, isLoading, error } = useQuery({
        queryKey: ["businesses", query, filters, page, pageSize],
        queryFn: () =>
            fetchBusinesses({ query, filters, page, pageSize }),
        // Keep previous page data visible while next page loads
        placeholderData: (prev) => prev,
    });

    return {
        businesses: data?.businesses ?? [],
        totalCount: data?.totalCount ?? 0,
        isLoading,
        error: error as Error | null,
    };
}
