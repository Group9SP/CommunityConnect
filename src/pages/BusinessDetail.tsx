import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import AuthButton from "@/components/AuthButton";
import { VerificationBadges } from "@/components/VerificationBadges";
import { Star, MapPin, Phone, Globe, Clock, DollarSign, Languages, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { imageForCategory } from "@/lib/categoryImages";
import type { BusinessVerificationFields } from "@/lib/verification";

type BusinessRow = BusinessVerificationFields & {
  id: string;
  business_name: string;
  category: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  price_level: number | null;
  languages: string[] | null;
  minority_verified?: boolean | null;
  howard_verified?: boolean | null;
};

const BusinessDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessRow | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("business_profiles")
      .select("*")
      .eq("id", id)
      .eq("verification_status", "verified")
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) setBusiness(null);
        else setBusiness(data as BusinessRow);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const reviews = [
    {
      userName: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment:
        "Amazing experience! Love supporting verified minority-owned businesses that care about quality and community.",
    },
    {
      userName: "Marcus Williams",
      rating: 5,
      date: "1 week ago",
      comment: "Proud to support a Black-owned business doing it right!",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Business not found or not verified.</p>
        <Link to="/browse">
          <Button variant="outline">Back to browse</Button>
        </Link>
      </div>
    );
  }

  const hero = imageForCategory(business.category);
  const rating = 4.5;
  const reviewCount = 0;
  const priceLevel = business.price_level ?? 2;
  const langs = business.languages ?? [];
  const vf: BusinessVerificationFields = {
    verification_status: business.verification_status,
    is_minority_owned: business.is_minority_owned,
    is_howard_affiliated: business.is_howard_affiliated,
    minority_verified: business.minority_verified ?? false,
    howard_verified: business.howard_verified ?? false,
  };
  const website = business.website?.replace(/^https?:\/\//, "") ?? "";

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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-2 h-[400px] mb-8">
          <div className="col-span-2 rounded-lg overflow-hidden">
            <img src={hero} alt={business.business_name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="rounded-lg overflow-hidden">
              <img src={hero} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src={hero} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <VerificationBadges business={vf} className="mb-3" />
              <h1 className="text-4xl font-bold mb-2">{business.business_name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{business.category}</p>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(rating) ? "fill-accent text-accent" : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{rating}</span>
                  <span className="text-muted-foreground">({reviewCount} reviews)</span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: priceLevel }).map((_, i) => (
                    <DollarSign key={i} className="h-4 w-4 text-muted-foreground" />
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">About</h2>
              <p className="leading-relaxed">{business.description ?? "No description provided."}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <ReviewCard key={index} {...review} />
                ))}
              </div>
            </div>
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
                    <p className="text-sm text-muted-foreground">{business.address ?? "—"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{business.phone ?? "—"}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Website</p>
                    {website ? (
                      <a
                        href={`https://${website}`}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {website}
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
                    <p className="text-sm text-muted-foreground">Contact business for hours</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-muted-foreground">
                      {langs.length ? langs.join(", ") : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessDetail;
