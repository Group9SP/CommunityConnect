export interface BusinessFilters {
    verified: boolean;
    howardAffiliated: boolean;
    categories: string[];
    maxPriceLevel: number; // 1–4
    minRating: number;     // 0 = any, 3 | 4 | 5
  }
  
  export const DEFAULT_FILTERS: BusinessFilters = {
    verified: false,
    howardAffiliated: false,
    categories: [],
    maxPriceLevel: 4,
    minRating: 0,
  };
  
  export const CATEGORIES = [
    "Restaurant",
    "Coffee & Tea",
    "Fashion & Retail",
    "Beauty & Wellness",
    "Services",
  ] as const;