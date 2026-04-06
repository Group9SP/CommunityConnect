import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import AuthButton from "@/components/AuthButton";
import { Star, MapPin, Phone, Globe, DollarSign, Languages, Loader2, Pencil } from "lucide-react";
import coffeeImage from "@/assets/business-coffee.jpg";
import { fetchBusinessProfileById, type BusinessProfileRow } from "@/integrations/amplify/businessProfiles";
import { useSession } from "@/features/auth/hooks/useSession";
import { BusinessLocationHours } from "@/components/BusinessLocationHours";
import { parseHours, isOpenNow } from "@/lib/businessHours";
import { reviewsByBusinessID } from "@/graphql/queries";
import { gqlClient } from "@/integrations/amplify/graphqlClient";

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
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
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
    hours: row.hours ?? "—",
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
      "Elevation Coffee House is a premium coffee destination committed to serving excellence in every cup. Founded by Howard University alumni in 2020, we source our beans ethically and roast them daily in-house.",
    amenities: ["WiFi", "Outdoor Seating", "Wheelchair Accessible", "Accepts Credit Cards"],
    source: "demo",
  },
};

const demoReviews = [
  { userName: "Sarah Johnson", rating: 5, date: "2 days ago", comment: "Amazing coffee and even better atmosphere! Love supporting a Howard-affiliated business." },
  { userName: "Marcus Williams", rating: 5, date: "1 week ago", comment: "Best coffee in DC hands down. Proud to support a Black-owned business doing it right!" },
  { userName: "Jennifer Lee", rating: 4, date: "2 weeks ago", comment: "Great local spot with delicious coffee and a warm vibe." },
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const queryClient = useQueryClient();

  // Track page visit
  useEffect(() => {
    if (!id) return;
    gqlClient.graphql({
      query: `mutation Track($input: UpdateBusinessProfileInput!) { updateBusinessProfile(input: $input) { id website_clicks } }`,
      variables: { input: { id, website_clicks: ((row as any)?.website_clicks ?? 0) + 1 } },
      authMode: "apiKey",
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch reviews for this business
  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const result = await gqlClient.graphql({
        query: reviewsByBusinessID,
        variables: { businessID: id! },
        authMode: "apiKey",
      });
      const items = result.data?.reviewsByBusinessID?.items ?? [];

      // Fetch reviewer names for reviews missing review_name
      const needsName = items.filter((r: any) => !r.review_name);
      if (needsName.length > 0) {
        const profileQuery = /* GraphQL */`
          query GetProfile($id: ID!) {
            getProfile(id: $id) { id full_name }
          }
        `;
        await Promise.all(needsName.map(async (r: any) => {
          try {
            const p: any = await gqlClient.graphql({
              query: profileQuery,
              variables: { id: r.userID },
              authMode: "apiKey",
            });
            r.review_name = p.data?.getProfile?.full_name ?? null;
          } catch { /* ignore */ }
        }));
      }
      return items;
    },
    enabled: !!id,
  });

  const reviews = (reviewsData ?? []).filter((r: any) => r.moderation_status === "approved");
  const userReview = session ? reviews.find((r: any) => r.userID === session.user.id) : null;

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
            <Link to="/" className="text-2xl font-bold text-primary">Community Connect</Link>
            <nav className="flex items-center gap-4">
              <Link to="/browse"><Button variant="ghost">Browse</Button></Link>
              {isOwner && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/business/${business.id}/manage`}>
                    <Pencil className="h-4 w-4 mr-1" />Manage
                  </Link>
                </Button>
              )}
              <AuthButton />
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero image */}
        <div className="h-[400px] mb-8 rounded-xl overflow-hidden">
          <img src={business.images[0]} alt={business.name} className="w-full h-full object-cover" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex gap-2 mb-3 flex-wrap">
                {business.isVerified && (
                  <Badge className="bg-green-600 text-white">✓ Verified Minority-Owned</Badge>
                )}
                {business.isHowardAffiliated && (
                  <Badge variant="secondary">Howard Affiliated</Badge>
                )}
                {business.source === "database" && !business.isVerified && (
                  <Badge variant="outline">Verification pending</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-2">{business.name}</h1>
              <p className="text-xl text-muted-foreground mb-2">{business.category}</p>

              {/* Open/closed status with today's hours + link */}
              {(() => {
                const hours = parseHours(row?.hours ?? null);
                if (!hours) return null;
                const open = isOpenNow(hours);
                const todayHours = hours[(new Date().getDay() + 6) % 7];
                return (
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={open ? "bg-green-600 text-white" : "bg-red-500 text-white"}>
                      {open ? "Open now" : "Closed now"}
                    </Badge>
                    {!todayHours.closed && (
                      <span className="text-sm text-muted-foreground">
                        {todayHours.open} – {todayHours.close}
                      </span>
                    )}
                    <button
                      className="text-sm text-primary hover:underline"
                      onClick={() => document.getElementById("hours-section")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      See hours ↓
                    </button>
                  </div>
                );
              })()}

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length : 0) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
                  ))}
                  {reviews.length > 0 && (
                    <span className="ml-1 font-semibold">
                      {(reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                  )}
                  <span className="text-muted-foreground ml-1">
                    {reviews.length > 0 ? `(${reviews.length} review${reviews.length !== 1 ? "s" : ""})` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: business.priceLevel }).map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-muted-foreground" />
                  ))}
                </div>
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
                    {business.amenities.map((a) => (
                      <Badge key={a} variant="secondary">{a}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Location & Hours */}
            <Separator />
            <div id="hours-section">
              <BusinessLocationHours address={business.location} hoursRaw={row?.hours ?? null} />
            </div>

            {/* Reviews section */}
            <Separator />
            <div>
              {/* Rating summary */}
              {reviews.length > 0 && (() => {
                const avg = reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length;
                const counts = [5,4,3,2,1].map(star => ({
                  star,
                  count: reviews.filter((r: any) => r.rating === star).length,
                }));
                return (
                  <div className="flex gap-8 items-start mb-6 p-4 bg-muted/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{avg.toFixed(1)}</div>
                      <div className="flex justify-center gap-0.5 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
                    </div>
                    <div className="flex-1 space-y-1">
                      {counts.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="w-4 text-right">{star}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(count / reviews.length) * 100}%` }} />
                          </div>
                          <span className="w-4 text-muted-foreground">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Write / Edit review button above reviews */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Reviews {reviews.length > 0 && <span className="text-muted-foreground text-lg">({reviews.length})</span>}
                </h2>
                {session && !isOwner && !userReview && !showReviewForm && (
                  <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                )}
                {session && !isOwner && userReview && !showReviewForm && (
                  <Button variant="outline" onClick={() => setShowReviewForm(true)}>Edit Your Review</Button>
                )}
                {!session && (
                  <Button variant="outline" asChild><Link to="/auth">Sign in to review</Link></Button>
                )}
              </div>

              {/* Inline review form */}
              {showReviewForm && session && !isOwner && (
                <div className="mb-6">
                  <ReviewForm
                    businessId={business.id}
                    userId={session.user.id}
                    userName={session.user.user_metadata?.full_name || session.user.email || "Community Member"}
                    existingReview={userReview ? { id: userReview.id, rating: userReview.rating, comment: userReview.comment } : null}
                    onSuccess={() => { setShowReviewForm(false); refetchReviews(); }}
                    onDelete={() => { setShowReviewForm(false); refetchReviews(); }}
                  />
                </div>
              )}

              {/* Review list */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <ReviewCard
                      key={review.id}
                      userName={review.review_name || (review.userID === session?.user.id ? (session.user.user_metadata?.full_name || "You") : "Community Member")}
                      rating={review.rating}
                      date={new Date(review.createdAt).toLocaleDateString()}
                      comment={review.comment}
                      isOwn={review.userID === session?.user.id}
                      onEdit={review.userID === session?.user.id ? () => setShowReviewForm(true) : undefined}
                      onDelete={review.userID === session?.user.id ? async () => {
                        const { gqlClient: gc } = await import("@/integrations/amplify/graphqlClient");
                        await gc.graphql({
                          query: `mutation Del($input: DeleteReviewInput!) { deleteReview(input: $input) { id } }`,
                          variables: { input: { id: review.id } },
                        });
                        refetchReviews();
                      } : undefined}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
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
                    <p className="text-sm text-muted-foreground">{business.phone}</p>
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
                  <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-muted-foreground">
                      {business.languages.length > 0 ? business.languages.join(", ") : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-secondary text-secondary-foreground py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Community Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessDetail;
