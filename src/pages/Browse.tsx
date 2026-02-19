import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BusinessCard } from "@/components/BusinessCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/AuthButton";
import { Search, X } from "lucide-react";
import { BusinessFilters, DEFAULT_FILTERS } from "@/types/business-filters";
import coffeeImage from "@/assets/business-coffee.jpg";
import restaurantImage from "@/assets/business-restaurant.jpg";
import boutiqueImage from "@/assets/business-boutique.jpg";
import salonImage from "@/assets/business-salon.jpg";


// Types
interface Business {
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
  description: string;
}

// ---------------------------------------------------------------------------

// Static data (future: replace with Supabase query that accepts filter params)
const ALL_BUSINESSES: Business[] = [
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
    description:
      "Premium coffee roasted daily with a mission to uplift the community. Howard alumni-owned since 2020.",
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
    description:
      "Contemporary soul food restaurant celebrating Black culinary excellence with locally-sourced ingredients.",
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
    description:
      "Curated fashion celebrating African diaspora designers. Founded by Howard University fashion alumna.",
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
    description:
      "Full-service salon specializing in natural hair care and protective styling. Howard student-owned.",
  },
];

// ---------------------------------------------------------------------------

// Pure filter function — keeps Browse render logic clean and unit-testable
function applyFilters(
  businesses: Business[],
  filters: BusinessFilters,
  query: string
): Business[] {
  const normalizedQuery = query.trim().toLowerCase();

  return businesses.filter((b) => {
    if (filters.verified && !b.isVerified) return false;
    if (filters.howardAffiliated && !b.isHowardAffiliated) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(b.category))
      return false;
    if (b.priceLevel > filters.maxPriceLevel) return false;
    if (filters.minRating > 0 && b.rating < filters.minRating) return false;

    if (normalizedQuery) {
      const searchable = `${b.name} ${b.category} ${b.description}`.toLowerCase();
      if (!searchable.includes(normalizedQuery)) return false;
    }

    return true;
  });
}

// ---------------------------------------------------------------------------

// Component
const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialise filter state from URL params so filters survive page refresh
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

  // Sync filters + search to URL params
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

  // Debounce search input (300 ms) — avoids filtering on every keystroke
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(value), 300);
  }, []);

  const filteredBusinesses = useMemo(
    () => applyFilters(ALL_BUSINESSES, filters, debouncedQuery),
    [filters, debouncedQuery]
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
      {/* Header */}
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

      {/* Search Bar */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Business Grid */}
          <main className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredBusinesses.length}
                </span>{" "}
                of {ALL_BUSINESSES.length} businesses
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear All Filters
                </Button>
              )}
            </div>

            {filteredBusinesses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard key={business.id} {...business} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No businesses match your filters.</p>
                <p className="text-sm mt-1">Try adjusting your search or clearing filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleClearAll}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
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