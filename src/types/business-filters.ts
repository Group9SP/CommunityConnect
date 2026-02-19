export interface BusinessFilters {
  verified: boolean;
  howardAffiliated: boolean;
  minorityOwned: boolean;
  categories: string[];
  maxPriceLevel: number; // 1–4
  minRating: number;     // 0 = any, 3 | 4 | 5
  sortBy: "rating" | "newest" | "mostReviewed";
}

export const DEFAULT_FILTERS: BusinessFilters = {
  verified: false,
  howardAffiliated: false,
  minorityOwned: false,
  categories: [],
  maxPriceLevel: 4,
  minRating: 0,
  sortBy: "rating",
};

export const CATEGORIES = [
  "Restaurant",
  "Coffee & Tea",
  "Fashion & Retail",
  "Beauty & Wellness",
  "Services",
] as const;

export const MINORITY_OWNED_CATEGORIES = [
  "Black-Owned",
  "Latinx-Owned",
  "Asian-Owned",
  "Native-Owned",
  "Women-Owned",
  "LGBTQ+-Owned",
] as const;

/** Human-readable labels for sort options. */
export const SORT_OPTIONS: { value: BusinessFilters["sortBy"]; label: string }[] =
  [
    { value: "rating", label: "Top Rated" },
    { value: "newest", label: "Newest" },
    { value: "mostReviewed", label: "Most Reviewed" },
  ];