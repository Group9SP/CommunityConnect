import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { ModerationStatus } from "@/API";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReviewCard } from "@/components/ReviewCard";
import AuthButton from "@/components/AuthButton";
import { Star, MapPin, Phone, Globe, DollarSign, MoreVertical } from "lucide-react";
import coffeeImage from "@/assets/business-coffee.jpg";
import { BusinessOpenStatus } from "@/components/BusinessOpenStatus";
import { ReviewStarChart } from "@/components/ReviewStarChart";

const client = generateClient();

// Inline mutation — skips nested user/business resolvers to avoid null ID error
const createReviewMutation = /* GraphQL */ `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      userID
      businessID
      moderation_status
      createdAt
    }
  }
`;

const BusinessDetail = () => {
  const { id } = useParams();

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // Edit/delete review state
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  // Dropdown state
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { userId } = await getCurrentUser();
        setCurrentUserId(userId);
        console.log("Current Cognito sub:", userId);
      } catch (err) {
        console.log("User not logged in", err);
      }
    };
    fetchUser();
  }, []);

  // fetchReviews defined outside useEffect so it can be called after submit
  // Uses userPool when logged in (so nested user { full_name } resolves correctly)
  // Uses apiKey for public/unauthenticated users (Review has { allow: public } rule)
  const fetchReviews = async () => {
    if (!id) return;
    setLoadingReviews(true);
    setReviewsError("");
    try {
      const res = await client.graphql({
        query: /* GraphQL */ `
          query ListReviews($filter: ModelReviewFilterInput, $limit: Int) {
            listReviews(filter: $filter, limit: $limit) {
              items {
                id
                rating
                comment
                userID
                businessID
                moderation_status
                createdAt
                user { full_name avatar_url }
              }
            }
          }
        `,
        variables: {
          filter: { businessID: { eq: id } },
          limit: 50,
        },
        authMode: "apiKey", // Always apiKey — returns ALL reviews, not just owner's
      });
      const items =
        (res as any).data?.listReviews?.items ||
        (res as any).value?.data?.listReviews?.items ||
        [];
      setReviews(items);
    } catch (err: any) {
      setReviewsError("Failed to load reviews");
      console.error("fetchReviews error:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Re-fetch when page loads or when currentUserId resolves
  useEffect(() => {
    fetchReviews();
  }, [id, currentUserId]);

  // Sample business data
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

  // Helper: Check if Profile exists for current user
  const checkProfileExists = async (userId: string) => {
    try {
      const res = await client.graphql({
        query: /* GraphQL */ `
          query GetProfile($id: ID!) {
            getProfile(id: $id) { id }
          }
        `,
        variables: { id: userId },
        authMode: "userPool",
      });
      const data = (res as any).data || (res as any).value?.data;
      return !!data?.getProfile?.id;
    } catch {
      return false;
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!currentUserId) {
      setSubmitError("You must be logged in to leave a review.");
      return;
    }

    const profileExists = await checkProfileExists(currentUserId);
    if (!profileExists) {
      setSubmitError("Your profile is still being created. Please wait a moment and try again.");
      return;
    }

    const reviewInput = {
      rating,
      comment,
      businessID: id || "",
      userID: currentUserId,
      moderation_status: ModerationStatus.pending,
    };
    console.log("Submitting review mutation with input:", reviewInput);

    try {
      await client.graphql({
        query: createReviewMutation,
        variables: { input: reviewInput },
        authMode: "userPool",
      });
      setSubmitted(true);
      setComment("");
      setRating(5);
      await fetchReviews();
    } catch (err: any) {
      setSubmitError(err.errors?.[0]?.message || "Error submitting review");
    }
  };

  // Get current user's review (if any)
  const userReview = reviews.find((r) => r.userID === currentUserId);

  // Open edit form for a review
  const handleEditReview = (review: any) => {
    setEditingReviewId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
  };

  // Save edited review
  const handleSaveEdit = async () => {
    if (!editingReviewId) return;
    try {
      await client.graphql({
        query: /* GraphQL */ `
          mutation UpdateReview($input: UpdateReviewInput!) {
            updateReview(input: $input) {
              id
              rating
              comment
              userID
              createdAt
            }
          }
        `,
        variables: {
          input: {
            id: editingReviewId,
            comment: editComment,
            rating: editRating,
          },
        },
        authMode: "userPool",
      });
      setEditingReviewId(null);
      setEditComment("");
      setEditRating(5);
      await fetchReviews();
    } catch (err: any) {
      setSubmitError(err.errors?.[0]?.message || "Error editing review");
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await client.graphql({
        query: /* GraphQL */ `
          mutation DeleteReview($input: DeleteReviewInput!) {
            deleteReview(input: $input) { id }
          }
        `,
        variables: { input: { id: reviewId } },
        authMode: "userPool",
      });
      await fetchReviews();
    } catch (err: any) {
      setSubmitError(err.errors?.[0]?.message || "Error deleting review");
    }
  };

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

      <div className="w-full">
        <img
          src={business.images[0]}
          alt={business.name}
          className="w-full h-72 md:h-96 object-cover"
          style={{ borderRadius: 0, boxShadow: "none", marginBottom: 0 }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex gap-2 mb-2">
            {business.isVerified && (
              <Badge className="bg-[hsl(var(--verified-badge))] text-white">✓ Verified Minority-Owned</Badge>
            )}
            {business.isHowardAffiliated && (
              <Badge className="bg-accent text-accent-foreground">Howard Affiliated</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">{business.name}</h1>
          <p className="text-lg text-muted-foreground mb-2">{business.category}</p>
          <div className="flex items-center gap-4 flex-wrap mb-2">
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
              <span className="font-semibold">{business.rating}</span>
              <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: business.priceLevel }).map((_, i) => (
                <DollarSign key={i} className="h-4 w-4 text-muted-foreground" />
              ))}
            </div>
          </div>
          <div className="mb-2">
            <BusinessOpenStatus hours={business.hours} />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" /> {business.location}
            <Phone className="h-4 w-4 ml-4" /> {business.phone}
            <Globe className="h-4 w-4 ml-4" />
            <a
              href={`https://${business.website}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
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
            <Separator />

            {/* Review summary + star chart */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Customer Reviews</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold">{business.rating}</span>
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
                  <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
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
              {/* All reviews list */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">All Reviews</h3>
                {loadingReviews ? (
                  <div>Loading reviews...</div>
                ) : reviewsError ? (
                  <div className="text-red-600">{reviewsError}</div>
                ) : reviews.length === 0 ? (
                  <div>No reviews yet. Be the first to leave one!</div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, index) => {
                      const isCurrentUser = review.userID === currentUserId;
                      const userName = review.user?.full_name || "Community Member";
                      return (
                        <div key={review.id || index} className="relative" id={`review-${review.id}`}>
                          <ReviewCard
                            userName={userName}
                            rating={review.rating}
                            date={review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                            comment={review.comment}
                          />
                          {/* Edit/delete dropdown — only visible to review owner */}
                          {isCurrentUser && (
                            <div className="absolute top-2 right-2">
                              <button
                                aria-label="More options"
                                onClick={() =>
                                  setDropdownOpenId(dropdownOpenId === review.id ? null : review.id)
                                }
                                className="p-1 rounded hover:bg-muted"
                                type="button"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                              {dropdownOpenId === review.id && (
                                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                                  <button
                                    className="block w-full text-left px-4 py-2 hover:bg-accent"
                                    onClick={() => {
                                      setDropdownOpenId(null);
                                      handleEditReview(review);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 hover:bg-destructive/20 text-destructive"
                                    onClick={() => {
                                      setDropdownOpenId(null);
                                      handleDeleteReview(review.id);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Inline edit form */}
                          {editingReviewId === review.id && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit();
                              }}
                              className="space-y-2 mt-2 p-4 border rounded"
                            >
                              <label className="block font-semibold">Edit Rating:</label>
                              <select
                                value={editRating}
                                onChange={(e) => setEditRating(Number(e.target.value))}
                                className="border rounded px-2 py-1"
                                required
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                              <label className="block font-semibold">Edit Comment:</label>
                              <textarea
                                className="w-full border rounded p-2"
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                required
                              />
                              <div className="flex gap-2">
                                <Button type="submit" size="sm">
                                  Save
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingReviewId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Review submission form */}
              <div className="mt-8" id="review-form">
                {!userReview && !submitted && (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold mb-2">Leave a Review</h3>
                    <div>
                      <label className="block font-semibold" htmlFor="review-rating">
                        Your Rating:
                      </label>
                      <select
                        id="review-rating"
                        name="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="border rounded px-2 py-1"
                        required
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold" htmlFor="review-comment">
                        Your Comment:
                      </label>
                      <textarea
                        id="review-comment"
                        name="comment"
                        className="w-full border rounded p-2"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                      />
                    </div>
                    {submitError && <div className="text-red-600">{submitError}</div>}
                    <Button type="submit" className="w-full">
                      Submit Review
                    </Button>
                  </form>
                )}
                {userReview && (
                  <div className="text-muted-foreground text-sm">
                    You have already left a review. You can edit it above.
                  </div>
                )}
                {submitted && (
                  <div className="text-green-600 font-semibold">Thank you for your review!</div>
                )}
              </div>
            </div>
          </div>

          {/* Business info sidebar */}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;