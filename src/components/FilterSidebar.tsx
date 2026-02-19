import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { CATEGORIES, BusinessFilters, DEFAULT_FILTERS } from "@/types/business-filters";

// ---------------------------------------------------------------------------

interface FilterSidebarProps {
  filters: BusinessFilters;
  onFilterChange: (filters: any) => void;
}

function countActiveFilters(filters: BusinessFilters): number {
  let count = 0;
  if (filters.verified) count++;
  if (filters.howardAffiliated) count++;
  if (filters.minorityOwned) count++;
  if (filters.categories.length > 0) count++;
  if (filters.minRating > 0) count++;
  if (filters.maxPriceLevel < 4) count++;
  return count;
}

// ---------------------------------------------------------------------------

export const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const activeCount = countActiveFilters(filters);

  function handleCategoryToggle(category: string, checked: boolean) {
    const next = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    onFilterChange({ ...filters, categories: next });
  }

  function handleRatingToggle(rating: number, checked: boolean) {
    // Only one minimum rating active at a time; unchecking resets to 0 (any)
    onFilterChange({ ...filters, minRating: checked ? rating : 0 });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Filter Businesses
            {activeCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeCount} active
              </Badge>
            )}
          </CardTitle>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-auto p-1"
              onClick={() => onFilterChange(DEFAULT_FILTERS)}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification */}
        <div className="space-y-3">
          <h3 className="font-semibold">Verification & Affiliation</h3>
          <div className="space-y-2">
            {/* Verified Minority-Owned */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={filters.verified}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, verified: !!checked })
                }
              />
              <Label htmlFor="verified" className="cursor-pointer">
                Verified Minority-Owned
              </Label>
            </div>

            {/* Howard Affiliated */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="howard"
                checked={filters.howardAffiliated}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, howardAffiliated: !!checked })
                }
              />
              <Label htmlFor="howard" className="cursor-pointer">
                Howard Affiliated
              </Label>
            </div>

            {/* Minority-Owned (F3.2.2 — distinct from "verified") */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="minorityOwned"
                checked={filters.minorityOwned}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, minorityOwned: !!checked })
                }
              />
              <Label htmlFor="minorityOwned" className="cursor-pointer">
                Minority-Owned
              </Label>
            </div>
          </div>
        </div>

        <Separator />
        {/* Category */}
        <div className="space-y-3">
          <h3 className="font-semibold">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryToggle(category, !!checked)
                  }
                />
                <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />
        {/* Price Range */}
        <div className="space-y-3">
          <h3 className="font-semibold">
            Max Price Level{" "}
            <span className="text-muted-foreground font-normal">
              {"$".repeat(filters.maxPriceLevel)}
            </span>
          </h3>
          <Slider
            value={[filters.maxPriceLevel]}
            min={1}
            max={4}
            step={1}
            onValueChange={([val]) =>
              onFilterChange({ ...filters, maxPriceLevel: val })
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$</span>
            <span>$$$$</span>
          </div>
        </div>

        <Separator />
        {/* Rating */}
        <div className="space-y-3">
          <h3 className="font-semibold">Minimum Rating</h3>
          <div className="space-y-2">
            {([5, 4, 3] as const).map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.minRating === rating}
                  onCheckedChange={(checked) =>
                    handleRatingToggle(rating, !!checked)
                  }
                />
                <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};



/*
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Businesses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold">Verification</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="cursor-pointer">
                Verified Minority-Owned
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="howard" />
              <Label htmlFor="howard" className="cursor-pointer">
                Howard Affiliated
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold">Category</h3>
          <div className="space-y-2">
            {["Restaurants", "Coffee & Tea", "Boutiques", "Salons & Spas", "Services"].map(
              (category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox id={category} />
                  <Label htmlFor={category} className="cursor-pointer">
                    {category}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold">Price Range</h3>
          <Slider defaultValue={[1]} max={4} min={1} step={1} />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$</span>
            <span>$$$$</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="font-semibold">Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
*/
