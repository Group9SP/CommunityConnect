import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import AuthButton from "@/components/AuthButton";
import { Star, MapPin, Phone, Globe, Clock, DollarSign, Languages } from "lucide-react";
import coffeeImage from "@/assets/business-coffee.jpg";

const BusinessDetail = () => {
  const { id } = useParams();

  // Sample business data (in real app, fetch based on id)
  const business = {
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

      {/* Hero Image Gallery */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-2 h-[400px]">
          <div className="col-span-2 rounded-lg overflow-hidden">
            <img
              src={business.images[0]}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="rounded-lg overflow-hidden">
              <img
                src={business.images[1]}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={business.images[2]}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                {business.isVerified && (
                  <Badge className="bg-[hsl(var(--verified-badge))] text-white">
                    ✓ Verified Minority-Owned
                  </Badge>
                )}
                {business.isHowardAffiliated && (
                  <Badge className="bg-accent text-accent-foreground">
                    Howard Affiliated
                  </Badge>
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
                          i < Math.floor(business.rating)
                            ? "fill-accent text-accent"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-muted-foreground">
                    ({business.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
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
          </div>

          {/* Sidebar Info */}
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
                    <a
                      href={`https://${business.website}`}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {business.website}
                    </a>
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
                      {business.languages.join(", ")}
                    </p>
                  </div>
                </div>

                <Separator />

                <Button className="w-full" size="lg">
                  Write a Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Community Business Connect. Empowering minority-owned businesses.</p>
        </div>
      </footer>
    </div>
  );
};

export default BusinessDetail;
