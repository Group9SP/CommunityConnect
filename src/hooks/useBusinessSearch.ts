import coffeeImage from "@/assets/business-coffee.jpg";
import restaurantImage from "@/assets/business-restaurant.jpg";
import boutiqueImage from "@/assets/business-boutique.jpg";
import salonImage from "@/assets/business-salon.jpg";
import { generateClient } from 'aws-amplify/api';
import { listBusinessProfiles } from '@/graphql/queries';
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
// Main async fetcher — tries Amplify, falls back to static data
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
    // Build Amplify filter object
    const filter: any = {};
    if (filters.verified) filter.verification_status = { eq: "verified" };
    if (filters.howardAffiliated) filter.is_howard_affiliated = { eq: true };
    if (filters.minorityOwned) filter.is_minority_owned = { eq: true };
    if (filters.categories.length > 0) filter.category = { in: filters.categories };
    if (filters.maxPriceLevel < 4) filter.price_level = { lte: filters.maxPriceLevel };
    // If you have a rating field in your schema, add it here
    // if (filters.minRating > 0) filter.rating = { gte: filters.minRating };
    if (query.trim()) {
        filter.or = [
            { business_name: { contains: query } },
            { category: { contains: query } },
            { address: { contains: query } },
            { description: { contains: query } },
        ];
    }

    const variables = {
        filter,
        limit: pageSize,
        // For real cursor-based pagination, handle nextToken here
    };

    try {
        const client = generateClient();
        const response: any = await client.graphql({
            query: listBusinessProfiles,
            variables
        });
        const items = response.data.listBusinessProfiles.items;

        // Map to your Business type as needed
        const businesses: Business[] = items.map((item: any) => ({
            id: item.id,
            name: item.business_name,
            category: item.category,
            image: '', // Map image if you have it
            rating: 0, // Map rating if you have it
            reviewCount: 0, // Map reviewCount if you have it
            priceLevel: item.price_level ?? 1,
            languages: item.languages ?? [],
            location: item.address ?? '',
            isVerified: item.verification_status === "verified",
            isHowardAffiliated: item.is_howard_affiliated ?? false,
            isMinorityOwned: item.is_minority_owned ?? false,
            description: item.description ?? '',
            createdAt: item.createdAt ?? new Date().toISOString(),
        }));

        return { businesses, totalCount: businesses.length };
    } catch (error) {
        // ── Graceful fallback: Amplify query failed ──
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
