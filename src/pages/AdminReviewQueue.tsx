import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthButton from "@/components/AuthButton";
import {
  usePendingBusinesses,
  useApproveBusiness,
  useRejectBusiness,
  type BusinessProfileReview,
} from "@/hooks/useAdminReviewQueue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, ClipboardList } from "lucide-react";
import { getVerificationStatusLabel, type VerificationStatus } from "@/lib/verificationStatus";

// Format submission timestamps into a compact, human-readable date.
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Present a single business row with approve / reject actions for admins.
function QueueRow({
  business,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  business: BusinessProfileReview;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isApproving: string | null;
  isRejecting: string | null;
}) {
  const busy = isApproving === business.id || isRejecting === business.id;

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{business.business_name}</div>
        {business.description && (
          <div className="text-muted-foreground text-xs mt-0.5 line-clamp-1">
            {business.description}
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="secondary">{business.category}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(business.created_at)}
      </TableCell>
      <TableCell>
        {/* Surface the current verification state so admins know what stage this listing is in. */}
        <Badge variant="secondary">
          {getVerificationStatusLabel(business.verification_status as VerificationStatus)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onApprove(business.id)}
            disabled={busy}
          >
            {isApproving === business.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" />
                Approve
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(business.id)}
            disabled={busy}
          >
            {isRejecting === business.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <X className="h-4 w-4 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminReviewQueue() {
  const { toast } = useToast();
  const { data: businesses = [], isLoading, isError, error } = usePendingBusinesses();
  const approveMutation = useApproveBusiness();
  const rejectMutation = useRejectBusiness();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  // Approve handler that wires toast feedback onto the approve mutation.
  const handleApprove = (id: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Business approved",
          description: "The business is now verified and visible on the platform.",
        });
      },
      onError: (err) => {
        toast({
          title: "Approval failed",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleRejectClick = (id: string) => setRejectTarget(id);

  // Confirm handler that actually performs the rejection after the dialog.
  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    rejectMutation.mutate(rejectTarget, {
      onSuccess: () => {
        setRejectTarget(null);
        toast({
          title: "Business rejected",
          description: "The listing has been marked as rejected.",
        });
      },
      onError: (err) => {
        toast({
          title: "Rejection failed",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Minority X-Change
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/browse">Browse</Link>
            <Link to="/admin/review" className="font-medium">
              Review queue
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Admin review queue
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Businesses waiting for verification. Approve to make them visible on the platform, or reject to decline the listing.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {isError && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <p className="font-medium">Failed to load review queue</p>
                <p className="text-sm mt-1">{error?.message ?? "Unknown error"}</p>
              </div>
            )}

            {!isLoading && !isError && businesses.length === 0 && (
              <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No pending businesses</p>
                <p className="text-sm mt-1">New submissions will appear here for review.</p>
              </div>
            )}

            {!isLoading && !isError && businesses.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[240px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businesses.map((b) => (
                    <QueueRow
                      key={b.id}
                      business={b}
                      onApprove={handleApprove}
                      onReject={handleRejectClick}
                      isApproving={approveMutation.isPending ? approveMutation.variables ?? null : null}
                      isRejecting={rejectMutation.isPending ? rejectMutation.variables ?? null : null}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this business?</AlertDialogTitle>
            <AlertDialogDescription>
              The listing will be marked as rejected and will not appear on the platform. The business owner can still see their listing in their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
