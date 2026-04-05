import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { gqlClient } from "@/integrations/amplify/graphqlClient";
import { ModerationStatus } from "@/API";

const createReviewMutation = /* GraphQL */ `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id rating comment userID businessID moderation_status createdAt
    }
  }
`;

const updateReviewMutation = /* GraphQL */ `
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id rating comment userID businessID moderation_status createdAt updatedAt
    }
  }
`;

const deleteReviewMutation = /* GraphQL */ `
  mutation DeleteReview($input: DeleteReviewInput!) {
    deleteReview(input: $input) { id }
  }
`;

type Props = {
  businessId: string;
  userId: string;
  userName: string;
  existingReview?: { id: string; rating: number; comment: string } | null;
  onSuccess?: () => void;
  onDelete?: () => void;
};

export function ReviewForm({ businessId, userId, userName, existingReview, onSuccess, onDelete }: Props) {
  const { toast } = useToast();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast({ title: "Select a star rating", variant: "destructive" }); return; }
    if (!comment.trim()) { toast({ title: "Write a comment", variant: "destructive" }); return; }

    setSubmitting(true);
    try {
      if (existingReview) {
        await gqlClient.graphql({
          query: updateReviewMutation,
          variables: { input: { id: existingReview.id, rating, comment: comment.trim() } },
        });
        toast({ title: "Review updated" });
      } else {
        await gqlClient.graphql({
          query: createReviewMutation,
          variables: {
            input: {
              rating,
              comment: comment.trim(),
              userID: userId,
              businessID: businessId,
              review_name: userName,
              moderation_status: ModerationStatus.approved,
            },
          },
        });
        toast({ title: "Review posted" });
      }
      onSuccess?.();
    } catch (e) {
      console.error("[ReviewForm] error:", e);
      toast({ title: "Could not submit review", description: e instanceof Error ? e.message : "Try again.", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    setDeleting(true);
    try {
      await gqlClient.graphql({
        query: deleteReviewMutation,
        variables: { input: { id: existingReview.id } },
      });
      toast({ title: "Review deleted" });
      onDelete?.();
    } catch (e) {
      toast({ title: "Could not delete review", variant: "destructive" });
    }
    setDeleting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-6 bg-card">
      <h3 className="font-semibold text-lg">{existingReview ? "Edit your review" : "Write a review"}</h3>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}>
            <Star className={`h-7 w-7 transition-colors ${star <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        maxLength={1000}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {existingReview ? "Save changes" : "Post review"}
        </Button>
        {existingReview && (
          <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete}>
            {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
