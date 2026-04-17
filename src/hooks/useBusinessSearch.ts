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
    const filter: any = {};
    if (filters.verified) filter.verification_status = { eq: "verified" };
    if (filters.howardAffiliated) filter.is_howard_affiliated = { eq: true };
    if (filters.minorityOwned) filter.is_minority_owned = { eq: true };
    if (filters.categories.length > 0) filter.category = { in: filters.categories };
    if (filters.maxPriceLevel < 4) filter.price_level = { lte: filters.maxPriceLevel };
    if (query.trim()) {
        filter.or = [
            { business_name: { contains: query } },
            { category: { contains: query } },
            { address: { contains: query } },
            { description: { contains: query } },
        ];
    }

    const variables: any = { limit: 100 };
    if (Object.keys(filter).length > 0) variables.filter = filter;

    try {
        const client = generateClient();
        const response: any = await client.graphql({
            query: listBusinessProfiles,
            variables,
            authMode: "apiKey",
        });
        const items = response.data.listBusinessProfiles.items;

        // Fetch review counts per business using apiKey (public read)
        const reviewCountQuery = /* GraphQL */ `
          query ReviewsByBusiness($businessID: ID!) {
            reviewsByBusinessID(businessID: $businessID) {
              items { id rating moderation_status }
            }
          }
        `;
        const reviewData = await Promise.all(
          items.map((item: any) =>
            client.graphql({ query: reviewCountQuery, variables: { businessID: item.id }, authMode: "apiKey" })
              .then((r: any) => ({ id: item.id, items: r.data?.reviewsByBusinessID?.items ?? [] }))
              .catch(() => ({ id: item.id, items: [] }))
          )
        );
        const reviewMap = new Map(reviewData.map((r: any) => [r.id, r.items]));

        // Map to Business type
        const businesses: Business[] = items.map((item: any) => {
            // Calculate rating and reviewCount if reviews are available
            let rating = 0;
            let reviewCount = 0;
            const itemReviews = (reviewMap.get(item.id) ?? []).filter((r: any) => r.moderation_status === 'approved');
            if (itemReviews.length > 0) {
                reviewCount = itemReviews.length;
                rating = Math.round((itemReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount) * 10) / 10;
            }
            return {
                id: item.id,
                name: item.business_name,
                category: item.category,
                image: item.logo_url || '',
                rating,
                reviewCount,
                priceLevel: item.price_level ?? 1,
                languages: item.languages?.filter(Boolean) ?? [],
                location: item.address ?? '',
                isVerified: item.verification_status === "verified",
                isHowardAffiliated: item.is_howard_affiliated ?? false,
                isMinorityOwned: item.is_minority_owned ?? false,
                description: item.description ?? '',
                createdAt: item.createdAt ?? new Date().toISOString(),
                verificationStatus: item.verification_status,
            };
        });

        // Apply client-side pagination after fetching all from DB
        const from = (page - 1) * pageSize;
        const paginated = businesses.slice(from, from + pageSize);

        return { businesses: paginated, totalCount: businesses.length };
    } catch (error) {
        // GraphQL failed — return empty rather than mixing static with DB data
        return { businesses: [], totalCount: 0 };
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
