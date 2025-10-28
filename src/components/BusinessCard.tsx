import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Languages } from "lucide-react";
import { Link } from "react-router-dom";

interface BusinessCardProps {
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

export const BusinessCard = ({
  id,
  name,
  category,
  image,
  rating,
  reviewCount,
  priceLevel,
  languages,
  location,
  isVerified,
  isHowardAffiliated,
  description,
}: BusinessCardProps) => {
  return (
    <Link to={`/business/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)] cursor-pointer group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {isVerified && (
              <Badge className="bg-[hsl(var(--verified-badge))] text-white">
                ✓ Verified
              </Badge>
            )}
            {isHowardAffiliated && (
              <Badge className="bg-accent text-accent-foreground">
                Howard Affiliated
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                {Array.from({ length: priceLevel }).map((_, i) => (
                  <DollarSign key={i} className="h-4 w-4" />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{category}</p>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewCount} reviews)
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
              {languages.length > 0 && (
                <div className="flex items-center gap-1">
                  <Languages className="h-4 w-4" />
                  <span>{languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
