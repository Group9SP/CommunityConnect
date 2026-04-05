import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { Search, X } from "lucide-react";
import { BusinessFilters, DEFAULT_FILTERS } from "@/types/business-filters";
import { supabase } from "@/integrations/supabase/client";
import { imageForCategory } from "@/lib/categoryImages";
import {
  passesHowardFilter,
  passesVerifiedMinorityFilter,
  type BusinessVerificationFields,
} from "@/lib/verification";

interface Business extends BusinessVerificationFields {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  languages: string[];
  location: string;
  description: string;
  isVerified: boolean;
  isHowardAffiliated: boolean;
}

function mapRowToBusiness(row: Record<string, unknown>): Business {
  const langs = (row.languages as string[] | null) ?? [];
  const vf: BusinessVerificationFields = {
    verification_status: (row.verification_status as string) ?? null,
    is_minority_owned: row.is_minority_owned as boolean | null,
    is_howard_affiliated: row.is_howard_affiliated as boolean | null,
    minority_verified: (row.minority_verified as boolean | null | undefined) ?? false,
    howard_verified: (row.howard_verified as boolean | null | undefined) ?? false,
  };

  return {
    id: row.id as string,
    name: (row.business_name as string) ?? "",
    category: (row.category as string) ?? "",
    image: imageForCategory((row.category as string) ?? ""),
    rating: 4.5,
    reviewCount: 0,
    priceLevel: (row.price_level as number) ?? 2,
    languages: langs.length ? langs : ["EN"],
    location: (row.address as string) || "Washington, DC",
    description: (row.description as string) || "",
    ...vf,
    isVerified:
      vf.verification_status === "verified" &&
      !!vf.is_minority_owned &&
      !!vf.minority_verified,
    isHowardAffiliated:
      vf.verification_status === "verified" &&
      !!vf.is_howard_affiliated &&
      !!vf.howard_verified,
  };
}

function applyFilters(
  businesses: Business[],
  filters: BusinessFilters,
  query: string
): Business[] {
  const normalizedQuery = query.trim().toLowerCase();

  return businesses.filter((b) => {
    if (!passesVerifiedMinorityFilter(b, filters.verified)) return false;
    if (!passesHowardFilter(b, filters.howardAffiliated)) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(b.category)) return false;
    if (b.priceLevel > filters.maxPriceLevel) return false;
    if (filters.minRating > 0 && b.rating < filters.minRating) return false;

    if (normalizedQuery) {
      const searchable = `${b.name} ${b.category} ${b.description}`.toLowerCase();
      if (!searchable.includes(normalizedQuery)) return false;
    }

    return true;
  });
}

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<BusinessFilters>(() => ({
    verified: searchParams.get("verified") === "true",
    howardAffiliated: searchParams.get("howardAffiliated") === "true",
    categories: searchParams.getAll("category"),
    maxPriceLevel: Number(searchParams.get("maxPrice") ?? 4),
    minRating: Number(searchParams.get("minRating") ?? 0),
  }));

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    supabase
      .from("business_profiles")
      .select("*")
      .eq("verification_status", "verified")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setBusinesses([]);
        } else {
          setBusinesses(data.map((row) => mapRowToBusiness(row as Record<string, unknown>)));
        }
        setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.verified) params.set("verified", "true");
    if (filters.howardAffiliated) params.set("howardAffiliated", "true");
    filters.categories.forEach((c) => params.append("category", c));
    if (filters.maxPriceLevel < 4) params.set("maxPrice", String(filters.maxPriceLevel));
    if (filters.minRating > 0) params.set("minRating", String(filters.minRating));
    if (debouncedQuery) params.set("q", debouncedQuery);
    setSearchParams(params, { replace: true });
  }, [filters, debouncedQuery, setSearchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  const filteredBusinesses = useMemo(
    () => applyFilters(businesses, filters, debouncedQuery),
    [businesses, filters, debouncedQuery]
  );

  const hasActiveFilters =
    filters.verified ||
    filters.howardAffiliated ||
    filters.categories.length > 0 ||
    filters.maxPriceLevel < 4 ||
    filters.minRating > 0 ||
    debouncedQuery !== "";

  function handleClearAll() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
    setDebouncedQuery("");
  }

  return (
    <div className="min-h-screen bg-background">
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

      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              Discover Minority-Owned Businesses
            </h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search businesses, categories, or descriptions..."
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                {listLoading ? (
                  "Loading businesses…"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-foreground">{filteredBusinesses.length}</span> of{" "}
                    {businesses.length} businesses
                  </>
                )}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-1">
                  <X className="h-3.5 w-3.5" />
                  Clear All Filters
                </Button>
              )}
            </div>

            {!listLoading && businesses.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No verified businesses in the directory yet.</p>
                <p className="text-sm mt-1 max-w-md mx-auto">
                  After migrations are applied and businesses are approved by an admin, they will appear here.
                </p>
              </div>
            ) : !listLoading && filteredBusinesses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>
            ) : !listLoading ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No businesses match your filters.</p>
                <p className="text-sm mt-1">Try adjusting your search or clearing filters.</p>
                <Button variant="outline" className="mt-4" onClick={handleClearAll}>
                  Clear All Filters
                </Button>
              </div>
            ) : null}
          </main>
        </div>
      </div>

      <footer className="bg-secondary text-secondary-foreground py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default Browse;
