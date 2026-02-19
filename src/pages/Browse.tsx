import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthButton from "@/components/AuthButton";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import {
  BusinessFilters,
  DEFAULT_FILTERS,
  SORT_OPTIONS,
} from "@/types/business-filters";
import { useBusinessSearch } from "@/hooks/useBusinessSearch";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PAGE_SIZE = 6;

// ---------------------------------------------------------------------------
// Helper: build filter state from URL search params
// ---------------------------------------------------------------------------

function filtersFromParams(params: URLSearchParams): BusinessFilters {
  const sortParam = params.get("sort");
  const validSort = (["rating", "newest", "mostReviewed"] as const).includes(
    sortParam as BusinessFilters["sortBy"]
  )
    ? (sortParam as BusinessFilters["sortBy"])
    : "rating";

  return {
    verified: params.get("verified") === "true",
    howardAffiliated: params.get("howardAffiliated") === "true",
    minorityOwned: params.get("minorityOwned") === "true",
    categories: params.getAll("category"),
    maxPriceLevel: Number(params.get("maxPrice") ?? 4),
    minRating: Number(params.get("minRating") ?? 0),
    sortBy: validSort,
  };
}

// ---------------------------------------------------------------------------

// Component
const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter state (F3.2.7 — init from URL) ──────────────────────────────
  const [filters, setFilters] = useState<BusinessFilters>(() =>
    filtersFromParams(searchParams)
  );

  // ── Search state with debounce (F3.2.4 / F3.2.5) ──────────────────────
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Pagination state (F3.2.8) ──────────────────────────────────────────
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));

  // ── Data from backend / static fallback ───────────────────────────────
  const { businesses, totalCount, isLoading } = useBusinessSearch({
    query: debouncedQuery,
    filters,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── Sync state → URL (F3.2.7) ─────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.verified) params.set("verified", "true");
    if (filters.howardAffiliated) params.set("howardAffiliated", "true");
    if (filters.minorityOwned) params.set("minorityOwned", "true");
    filters.categories.forEach((c) => params.append("category", c));
    if (filters.maxPriceLevel < 4) params.set("maxPrice", String(filters.maxPriceLevel));
    if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
    if (filters.sortBy !== "rating") params.set("sort", filters.sortBy);
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (page > 1) params.set("page", String(page));
    setSearchParams(params, { replace: true });
  }, [filters, debouncedQuery, page, setSearchParams]);

  // Debounce search input (300 ms) — avoids filtering on every keystroke
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to page 1 on new search
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);
/*
const filteredBusinesses = useMemo(
    () => applyFilters(ALL_BUSINESSES, filters, debouncedQuery),
    [filters, debouncedQuery]
  );
  */
 
  // Reset page when filters change
  const handleFilterChange = useCallback((next: BusinessFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  // ── Clear all ─────────────────────────────────────────────────────────
  function handleClearAll() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setDebouncedQuery("");
    setPage(1);
  }

  // ── Active filter detection ────────────────────────────────────────────
  const hasActiveFilters =
    filters.verified ||
    filters.howardAffiliated ||
    filters.minorityOwned ||
    filters.categories.length > 0 ||
    filters.maxPriceLevel < 4 ||
    filters.minRating > 0 ||
    debouncedQuery !== "";

  // ── Active chip list (F3.2.6) ─────────────────────────────────────────
  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(filters.verified
      ? [
        {
          label: "Verified",
          onRemove: () => handleFilterChange({ ...filters, verified: false }),
        },
      ]
      : []),
    ...(filters.howardAffiliated
      ? [
        {
          label: "Howard Affiliated",
          onRemove: () =>
            handleFilterChange({ ...filters, howardAffiliated: false }),
        },
      ]
      : []),
    ...(filters.minorityOwned
      ? [
        {
          label: "Minority-Owned",
          onRemove: () =>
            handleFilterChange({ ...filters, minorityOwned: false }),
        },
      ]
      : []),
    ...filters.categories.map((cat) => ({
      label: cat,
      onRemove: () =>
        handleFilterChange({
          ...filters,
          categories: filters.categories.filter((c) => c !== cat),
        }),
    })),
    ...(filters.minRating > 0
      ? [
        {
          label: `${filters.minRating}+ Stars`,
          onRemove: () => handleFilterChange({ ...filters, minRating: 0 }),
        },
      ]
      : []),
    ...(filters.maxPriceLevel < 4
      ? [
        {
          label: `Max ${"$".repeat(filters.maxPriceLevel)}`,
          onRemove: () =>
            handleFilterChange({ ...filters, maxPriceLevel: 4 }),
        },
      ]
      : []),
  ];

  // ── Skeleton cards for loading state ──────────────────────────────────
  const skeletonCards = Array.from({ length: PAGE_SIZE });

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Community Connect
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/browse">
                <Button variant="ghost">Browse</Button>
              </Link>
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero + Search Bar (F3.2.1 / F3.2.4 / F3.2.5) ── */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Discover Minority-Owned Businesses
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="browse-search"
                placeholder="Search by name, category, or location…"
                className="pl-12 pr-12 h-14 text-lg bg-white"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => handleSearchChange("")}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Filter Chips (F3.2.6) ── */}
      {activeChips.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground font-medium">
                Active filters:
              </span>
              {activeChips.map(({ label, onRemove }) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={onRemove}
                >
                  {label}
                  <X className="h-3 w-3 ml-0.5" />
                </Badge>
              ))}
              <button
                onClick={handleClearAll}
                className="text-xs text-muted-foreground underline hover:text-foreground ml-1"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── Sidebar (F3.2.6) ── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* ── Results grid ── */}
          <main className="lg:col-span-3">

            {/* Results bar: count + sort (F3.2.3) */}
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Loading…"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {businesses.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {totalCount}
                    </span>{" "}
                    businesses
                  </>
                )}
              </p>

              <div className="flex items-center gap-3">
                {/* Sort dropdown (F3.2.3) */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(val) =>
                    handleFilterChange({
                      ...filters,
                      sortBy: val as BusinessFilters["sortBy"],
                    })
                  }
                >
                  <SelectTrigger className="w-44 h-9 text-sm" id="sort-select">
                    <SelectValue placeholder="Sort by…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Business cards or skeleton or empty state */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {skeletonCards.map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            ) : businesses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {businesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">
                  No businesses match your filters.
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your search or clearing filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleClearAll}
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* ── Pagination (F3.2.8) ── */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-secondary text-secondary-foreground py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>

    </div>
  );
};

export default Browse;




/*
import { useState } from "react";
import { Link } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { Search } from "lucide-react";
import coffeeImage from "@/assets/business-coffee.jpg";
import restaurantImage from "@/assets/business-restaurant.jpg";
import boutiqueImage from "@/assets/business-boutique.jpg";
import salonImage from "@/assets/business-salon.jpg";

const Browse = () => {
  const [filters, setFilters] = useState({});

  // Sample business data
  const businesses = [
    {
      id: "1",
      name: "Elevation Coffee House",
      category: "Coffee & Tea",
      image: coffeeImage,
      rating: 4.8,
      reviewCount: 124,
      priceLevel: 2,
      languages: ["EN", "ES"],
      location: "Washington, DC",
      isVerified: true,
      isHowardAffiliated: true,
      description: "Premium coffee roasted daily with a mission to uplift the community. Howard alumni-owned since 2020.",
    },
    {
      id: "2",
      name: "Soul & Flavor Bistro",
      category: "Restaurant",
      image: restaurantImage,
      rating: 4.9,
      reviewCount: 286,
      priceLevel: 3,
      languages: ["EN"],
      location: "Washington, DC",
      isVerified: true,
      isHowardAffiliated: false,
      description: "Contemporary soul food restaurant celebrating Black culinary excellence with locally-sourced ingredients.",
    },
    {
      id: "3",
      name: "Heritage Boutique",
      category: "Fashion & Retail",
      image: boutiqueImage,
      rating: 4.7,
      reviewCount: 92,
      priceLevel: 3,
      languages: ["EN", "FR"],
      location: "Washington, DC",
      isVerified: true,
      isHowardAffiliated: true,
      description: "Curated fashion celebrating African diaspora designers. Founded by Howard University fashion alumna.",
    },
    {
      id: "4",
      name: "Crown & Glory Salon",
      category: "Beauty & Wellness",
      image: salonImage,
      rating: 5.0,
      reviewCount: 156,
      priceLevel: 2,
      languages: ["EN"],
      location: "Washington, DC",
      isVerified: true,
      isHowardAffiliated: true,
      description: "Full-service salon specializing in natural hair care and protective styling. Howard student-owned.",
    },
  ];
*/


  //return (
    //<div className="min-h-screen bg-background">
      { /* Header */ }
/*
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Community Connect
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/browse">
                <Button variant="ghost">Browse</Button>
              </Link>
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>
*/
      {/* Search Bar */}
/*
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Discover Minority-Owned Businesses
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search businesses, categories, or locations..."
                className="pl-12 h-14 text-lg bg-white"
              />
            </div>
          </div>
        </div>
      </div>
*/
      {/* Main Content */}
/*
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
*/

          { /* Filters Sidebar */}
/*
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar onFilterChange={setFilters} />
            </div>
          </aside>
*/
          {/* Business Grid */}
/*
          <main className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {businesses.length} verified businesses
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </main>
        </div>
      </div>
*/
      {/* Footer */}
/*
      <footer className="bg-secondary text-secondary-foreground py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};
*/ 

//export default Browse;  