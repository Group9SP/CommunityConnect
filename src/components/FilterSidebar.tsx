import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
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
