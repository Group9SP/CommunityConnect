import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAppSession } from "@/integrations/amplify/authSession";
import {
  createBusinessProfile,
  DuplicateBusinessProfileError,
  getBusinessProfileForUser,
} from "@/integrations/amplify/businessProfiles";
import { addBusinessSchema, type AddBusinessFormValues } from "@/lib/businessFormSchema";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { BusinessListingFormFields } from "@/features/business/components/BusinessListingFormFields";

export default function AddBusiness() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const form = useForm<AddBusinessFormValues>({
    resolver: zodResolver(addBusinessSchema),
    defaultValues: {
      business_name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      price_level: 2,
      languages: "English",
      is_minority_owned: true,
      is_howard_affiliated: false,
      logoFile: null,
      verification_attestation: false,
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCheckingExisting(true);
      const session = await getAppSession();
      if (!session || cancelled) {
        if (!cancelled) setCheckingExisting(false);
        return;
      }
      const row = await getBusinessProfileForUser(session.user.id);
      if (!cancelled && row && !row.deleted_at) {
        navigate(`/business/${row.id}/manage`, { replace: true });
        return;
      }
      if (!cancelled) setCheckingExisting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const onSubmit = async (values: AddBusinessFormValues) => {
    setSubmitting(true);

    try {
      const session = await getAppSession();

      if (!session) {
        toast({
          title: "Not signed in",
          description: "Please sign in as a business owner to list your business.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const payload = {
        business_name: values.business_name.trim(),
        category: values.category.trim(),
        description: values.description?.trim() || undefined,
        address: values.address?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        website: values.website?.trim() || undefined,
        price_level: values.price_level,
        languages: values.languages
          .split(",")
          .map((lang) => lang.trim())
          .filter(Boolean),
        is_minority_owned: values.is_minority_owned,
        is_howard_affiliated: values.is_howard_affiliated,
        logoFile: values.logoFile instanceof File ? values.logoFile : null,
      };

      const { row, logoUploadFailed } = await createBusinessProfile(payload, session.user.id);

      if (logoUploadFailed) {
        toast({
          title: "Business saved — logo upload failed",
          description: "Your listing was created. You can upload a logo later from Manage listing.",
          variant: "default",
        });
      } else {
        toast({
          title: "Business submitted",
          description: "Your business is saved as a draft. Publish when you are ready; admins still verify before public discovery.",
        });
      }

      navigate(`/business/${row.id}/manage`);
    } catch (error: unknown) {
      if (error instanceof DuplicateBusinessProfileError) {
        toast({
          title: "Listing already exists",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      const message = error instanceof Error ? error.message : "Something went wrong while listing your business.";
      console.error("[AddBusiness] createBusinessProfile error:", error);
      toast({
        title: "Could not list business",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            Minority X-Change
          </Link>
          <AuthButton />
        </div>
      </header>

      <div className="py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add business</h1>
            <p className="text-muted-foreground mt-1">
              Required fields are marked. Optional details help customers find and trust your listing.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Business profile</CardTitle>
              <CardDescription>Name, category, and how you appear to the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <BusinessListingFormFields control={form.control} />

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold">Verification submission</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our team reviews minority-owned and Howard-affiliated claims before your listing can appear as
                        verified in search. Inaccurate information may delay or reject approval.
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="verification_attestation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Accuracy & verification (required)</FormLabel>
                            <FormDescription>
                              I confirm the information above is accurate to the best of my knowledge, and I authorize
                              Minority X-Change to review this listing for verification purposes.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Save listing (draft)"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
