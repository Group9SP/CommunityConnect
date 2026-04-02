import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  countBusinessProfileHistory,
  fetchBusinessProfileById,
  setListingVisibility,
  softDeleteBusinessProfile,
  updateBusinessProfile,
  type ListingVisibility,
} from "@/integrations/supabase/businessProfiles";
import { editBusinessSchema, type EditBusinessFormValues } from "@/lib/businessFormSchema";
import { getVerificationStatusDescription, getVerificationStatusLabel } from "@/lib/verificationStatus";
import type { VerificationStatus } from "@/lib/verificationStatus";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/features/auth/hooks/useSession";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, BarChart3, ExternalLink } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { BusinessListingFormFields } from "@/features/business/components/BusinessListingFormFields";

export default function ManageBusiness() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useSession();

  const businessQuery = useQuery({
    queryKey: ["business-profile", id],
    queryFn: () => fetchBusinessProfileById(id!),
    enabled: !!id,
  });

  const historyQuery = useQuery({
    queryKey: ["business-profile-history-count", id],
    queryFn: () => countBusinessProfileHistory(id!),
    enabled: !!id && !!businessQuery.data && businessQuery.data.user_id === session?.user.id,
  });

  const defaultValues = useMemo((): EditBusinessFormValues | null => {
    const row = businessQuery.data;
    if (!row) return null;
    return {
      business_name: row.business_name,
      category: row.category,
      description: row.description ?? "",
      address: row.address ?? "",
      phone: row.phone ?? "",
      website: row.website ?? "",
      price_level: row.price_level,
      languages: (row.languages ?? ["English"]).join(", "),
      is_minority_owned: row.is_minority_owned,
      is_howard_affiliated: row.is_howard_affiliated,
      logoFile: null,
    };
  }, [businessQuery.data]);

  const form = useForm<EditBusinessFormValues>({
    resolver: zodResolver(editBusinessSchema),
    defaultValues: {
      business_name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      price_level: 2,
      languages: "English",
      is_minority_owned: false,
      is_howard_affiliated: false,
      logoFile: null,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const visibilityMutation = useMutation({
    mutationFn: async (next: ListingVisibility) => {
      if (!id || !session?.user.id) throw new Error("Not signed in");
      return setListingVisibility(id, session.user.id, next);
    },
    onSuccess: (_, next) => {
      queryClient.invalidateQueries({ queryKey: ["business-profile", id] });
      toast({
        title: next === "published" ? "Listing published" : "Listing set to draft",
        description:
          next === "published"
            ? "Customers only discover verified listings that are published and not removed."
            : "Your listing stays hidden from public browse while in draft.",
      });
    },
    onError: (e: Error) => {
      toast({ title: "Could not update visibility", description: e.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: EditBusinessFormValues) => {
      if (!id || !session?.user.id) throw new Error("Not signed in");
      return updateBusinessProfile(id, session.user.id, {
        business_name: values.business_name.trim(),
        category: values.category.trim(),
        description: values.description?.trim() || undefined,
        address: values.address?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        website: values.website?.trim() || undefined,
        price_level: values.price_level,
        languages: values.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        is_minority_owned: values.is_minority_owned,
        is_howard_affiliated: values.is_howard_affiliated,
        logoFile: values.logoFile instanceof File ? values.logoFile : null,
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["business-profile", id] });
      queryClient.invalidateQueries({ queryKey: ["public-businesses"] });
      if (result.logoUploadFailed) {
        toast({
          title: "Profile updated — logo upload failed",
          description: "Other changes were saved. Try the logo again in a moment.",
          variant: "default",
        });
      } else {
        toast({ title: "Listing updated", description: "Your changes have been saved." });
      }
      form.reset({
        ...form.getValues(),
        logoFile: null,
      });
    },
    onError: (e: Error) => {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id || !session?.user.id) throw new Error("Not signed in");
      return softDeleteBusinessProfile(id, session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-businesses"] });
      toast({
        title: "Listing removed",
        description: "Your business was soft-deleted: it no longer appears publicly, but records are retained for verification and audit.",
      });
      navigate("/owner/business", { replace: true });
    },
    onError: (e: Error) => {
      toast({ title: "Could not remove listing", description: e.message, variant: "destructive" });
    },
  });

  const row = businessQuery.data;
  const isOwner = !!row && !!session && row.user_id === session.user.id;
  const isDeleted = !!row?.deleted_at;

  if (businessQuery.isLoading || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (businessQuery.isError || !row) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">We could not load this listing, or you do not have access.</p>
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground text-center">Owner-only: this dashboard is for the business owner.</p>
        <Button asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </div>
    );
  }

  const vStatus = row.verification_status as VerificationStatus;
  const canDiscover =
    vStatus === "verified" && row.listing_visibility === "published" && !row.deleted_at;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold text-primary shrink-0">
            Community Connect
          </Link>
          <div className="flex items-center gap-2">
            {canDiscover && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/business/${row.id}`} className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  Public page
                </Link>
              </Button>
            )}
            <AuthButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-bold">Manage listing</h1>
          <Badge variant="secondary">{getVerificationStatusLabel(vStatus)}</Badge>
          <Badge variant="outline">{row.listing_visibility === "published" ? "Published" : "Draft"}</Badge>
          {isDeleted && <Badge variant="destructive">Removed</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{getVerificationStatusDescription(vStatus)}</p>

        {isDeleted && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader className="py-4">
              <CardTitle className="text-base">Listing removed</CardTitle>
              <CardDescription>
                This business was soft-deleted. It is hidden from public browse; records remain for audit. You can
                submit a listing again from Add business (reactivates your row if you use the same account).
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Edit business info</CardTitle>
            <CardDescription>Update how your listing appears to reviewers and customers.</CardDescription>
          </CardHeader>
          <CardContent>
            {defaultValues ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((v) => updateMutation.mutate(v))}
                  className="space-y-6"
                >
                  <BusinessListingFormFields control={form.control} />
                  <Button type="submit" disabled={updateMutation.isPending || isDeleted}>
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Loader2 className="h-6 w-6 animate-spin" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
            <CardDescription>
              Draft vs published controls whether your listing is eligible for public browse once verified. Unverified
              listings never appear in discovery, even when published.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="publish-switch">Published</Label>
                <p className="text-sm text-muted-foreground">
                  When off, the listing stays in draft (owner-only preview path still applies).
                </p>
              </div>
              <Switch
                id="publish-switch"
                checked={row.listing_visibility === "published"}
                disabled={visibilityMutation.isPending || isDeleted}
                onCheckedChange={(checked) =>
                  visibilityMutation.mutate(checked ? "published" : "draft")
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business analytics
            </CardTitle>
            <CardDescription>Snapshot based on your listing and audit activity (not live marketing analytics).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Verification</span>
              <span className="font-medium">{getVerificationStatusLabel(vStatus)}</span>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Visibility</span>
              <span className="font-medium">{row.listing_visibility === "published" ? "Published" : "Draft"}</span>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Created</span>
              <span className="font-medium">{format(new Date(row.created_at), "PPp")}</span>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Last updated</span>
              <span className="font-medium">{format(new Date(row.updated_at), "PPp")}</span>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Profile change events</span>
              <span className="font-medium">{historyQuery.isLoading ? "…" : (historyQuery.data ?? 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Remove listing</CardTitle>
            <CardDescription>
              Soft delete (F4.2.6): the row is retained for verification and audit history, but the listing no longer
              appears in public browse. This does not delete your login or customer account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleted || deleteMutation.isPending}>
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing…
                    </>
                  ) : (
                    "Remove listing"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove this business listing?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This performs a soft delete: your data stays in our systems for compliance and audit, but customers
                    will not see this listing. You can create a fresh listing later if your account has no active row.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => deleteMutation.mutate()}
                  >
                    Confirm soft delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
