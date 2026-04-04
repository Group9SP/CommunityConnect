import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import AuthButton from "@/components/AuthButton";
import { Star, MapPin, Phone, Globe, Clock, DollarSign, Languages, Loader2, Pencil } from "lucide-react";
import coffeeImage from "@/assets/business-coffee.jpg";
import { fetchBusinessProfileById, type BusinessProfileRow } from "@/integrations/amplify/businessProfiles";
import { useSession } from "@/features/auth/hooks/useSession";

type DetailModel = {
  id: string;
  name: string;
  category: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceLevel: number;
  languages: string[];
  location: string;
  phone: string;
  website: string;
  hours: string;
  isVerified: boolean;
  isHowardAffiliated: boolean;
  description: string;
  amenities: string[];
  source: "database" | "demo";
};

function websiteHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "#";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function mapRowToDetail(row: BusinessProfileRow): DetailModel {
  const hero = row.logo_url ?? coffeeImage;
  return {
    id: row.id,
    name: row.business_name,
    category: row.category,
    images: [hero, hero, hero],
    rating: 0,
    reviewCount: 0,
    priceLevel: row.price_level,
    languages: row.languages ?? [],
    location: row.address ?? "—",
    phone: row.phone ?? "—",
    website: row.website ?? "",
    hours: "—",
    isVerified: row.verification_status === "verified",
    isHowardAffiliated: row.is_howard_affiliated,
    description: row.description ?? "No description yet.",
    amenities: [],
    source: "database",
  };
}

const DEMO_BY_ID: Record<string, DetailModel> = {
  "1": {
    id: "1",
    name: "Elevation Coffee House",
    category: "Coffee & Tea",
    images: [coffeeImage, coffeeImage, coffeeImage],
    rating: 4.8,
    reviewCount: 124,
    priceLevel: 2,
    languages: ["English", "Spanish"],
    location: "1234 Main St NW, Washington, DC 20001",
    phone: "(202) 555-0123",
    website: "www.elevationcoffee.com",
    hours: "Mon-Fri: 7am-7pm, Sat-Sun: 8am-8pm",
    isVerified: true,
    isHowardAffiliated: true,
    description:
      "Elevation Coffee House is a premium coffee destination committed to serving excellence in every cup. Founded by Howard University alumni in 2020, we source our beans ethically and roast them daily in-house. Our mission extends beyond great coffee—we're dedicated to uplifting our community through employment opportunities, education, and creating a welcoming space for all.",
    amenities: ["WiFi", "Outdoor Seating", "Wheelchair Accessible", "Accepts Credit Cards"],
    source: "demo",
  },
};

const reviews = [
  {
    userName: "Sarah Johnson",
    rating: 5,
    date: "2 days ago",
    comment:
      "Amazing coffee and even better atmosphere! The staff is incredibly friendly and knowledgeable. Love supporting a Howard-affiliated business that truly cares about quality and community.",
  },
  {
    userName: "Marcus Williams",
    rating: 5,
    date: "1 week ago",
    comment:
      "Best coffee in DC hands down. The espresso is perfectly balanced and the pastries are fresh daily. Proud to support a Black-owned business doing it right!",
  },
  {
    userName: "Jennifer Lee",
    rating: 4,
    date: "2 weeks ago",
    comment:
      "Great local spot with delicious coffee and a warm vibe. Sometimes gets busy during morning rush, but worth the wait. Love their commitment to community.",
  },
];

const BusinessDetail = () => {
  const { id } = useParams();
  const { session } = useSession();

  const { data: row, isLoading } = useQuery({
    queryKey: ["business-profile", id],
    queryFn: () => fetchBusinessProfileById(id!),
    enabled: !!id,
  });

  const business = useMemo((): DetailModel | null => {
    if (!id) return null;
    if (row) return mapRowToDetail(row);
    return DEMO_BY_ID[id] ?? null;
  }, [id, row]);

  const isOwner = row && session && row.user_id === session.user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Business not found.</p>
        <Button asChild variant="outline">
          <Link to="/browse">Back to browse</Link>
        </Button>
      </div>
    );
  }

  const showReviews = business.source === "demo";
  const showAmenities = business.amenities.length > 0;

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
              {isOwner && business.source === "database" && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/business/${business.id}/manage`}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Manage
                  </Link>
                </Button>
              )}
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-2 h-[400px]">
          <div className="col-span-2 rounded-lg overflow-hidden">
            <img src={business.images[0]} alt={business.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="rounded-lg overflow-hidden">
              <img src={business.images[1]} alt={business.name} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src={business.images[2]} alt={business.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="mb-2">
            <BusinessOpenStatus hours={business.hours} />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" /> {business.location}
            <Phone className="h-4 w-4 ml-4" /> {currentUserId ? business.phone : "(hidden)"}
            <Globe className="h-4 w-4 ml-4" />
            <a
              href={`https://${business.website}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEngagementEvent({
                  businessID: id || '',
                  userID: currentUserId || undefined,
                  type: 'website_click',
                });
              }}
            >
              {business.website}
            </a>
          </div>
          <div className="text-base leading-relaxed mb-2">{business.description}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {business.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary">
                {amenity}
              </Badge>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Hours: {business.hours}</div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {business.isVerified && (
                  <Badge className="bg-[hsl(var(--verified-badge))] text-white">✓ Verified Minority-Owned</Badge>
                )}
                {business.isHowardAffiliated && (
                  <Badge className="bg-accent text-accent-foreground">Howard Affiliated</Badge>
                )}
                {business.source === "database" && !business.isVerified && (
                  <Badge variant="secondary">Verification pending</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{business.category}</p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(business.rating) ? "fill-accent text-accent" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{business.rating > 0 ? business.rating : "—"}</span>
                  <span className="text-muted-foreground">
                    {business.reviewCount > 0 ? `(${business.reviewCount} reviews)` : "(no reviews yet)"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: business.priceLevel }).map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-muted-foreground" />
                  ))}
                </div>
                <ReviewStarChart reviews={reviews} />
              </div>
              <div>
                <Button
                  onClick={() => {
                    if (userReview) {
                      const el = document.getElementById(`review-${userReview.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                      setEditingReviewId(userReview.id);
                      setEditComment(userReview.comment);
                      setEditRating(userReview.rating);
                    } else {
                      const el = document.getElementById("review-form");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                  variant="default"
                  className="w-full md:w-auto"
                >
                  {userReview ? "Edit Your Review" : "Write a Review"}
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="leading-relaxed">{business.description}</p>
            </div>

            {showAmenities && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {showReviews && (
              <>
                <Separator />
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <ReviewCard key={index} {...review} />
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-6">
                    Load More Reviews
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{business.location}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{currentUserId ? business.phone : "(hidden)"}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Website</p>
                    {business.website ? (
                      <a
                        href={websiteHref(business.website)}
                        className="text-sm text-primary hover:underline break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {business.website}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">—</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">{business.hours}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Languages Spoken</p>
                    <p className="text-sm text-muted-foreground">
                      {business.languages.length > 0 ? business.languages.join(", ") : "—"}
                    </p>
                  </div>
                </div>

                <Separator />

                <Button className="w-full" size="lg" disabled={!showReviews}>
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessDetail;