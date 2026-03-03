import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { createBusinessProfile, AddBusinessFormValues } from "@/integrations/supabase/businessProfiles";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const addBusinessSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  description: z.string().max(1000, "Description is too long").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\d+\-\s()]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  price_level: z.coerce.number().int().min(1).max(4).default(2),
  languages: z.string().default("English"),
  is_minority_owned: z.boolean().default(false),
  is_howard_affiliated: z.boolean().default(false),
  logoFile: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .or(z.any().transform(() => null)),
});

type AddBusinessSchema = z.infer<typeof addBusinessSchema>;

export default function AddBusiness() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AddBusinessSchema>({
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
    },
  });

  const onSubmit = async (values: AddBusinessSchema) => {
    setSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        toast({
          title: "Not signed in",
          description: "Please sign in as a business owner to list your business.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const payload: AddBusinessFormValues = {
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

      const business = await createBusinessProfile(payload, session.user.id);

      toast({
        title: "Business submitted",
        description: "Your business has been submitted for review.",
      });

      navigate(`/business/${business.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong while listing your business.";
      toast({
        title: "Could not list business",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">List your business</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                          <Input placeholder="Community Cafe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Restaurant, Retail, Services..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share what makes your business special, and how you serve the community."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Up to 1000 characters.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourbusiness.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price level (1-4)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={4} {...field} />
                        </FormControl>
                        <FormDescription>1 = budget-friendly, 4 = premium.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages spoken</FormLabel>
                        <FormControl>
                          <Input placeholder="English, Spanish, French" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated list of languages.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="is_minority_owned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(!!checked)}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Minority-owned business</FormLabel>
                          <FormDescription>
                            You confirm that this business is majority-owned by members of a historically marginalized group.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_howard_affiliated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(!!checked)}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Howard-affiliated business</FormLabel>
                          <FormDescription>
                            The owner or founding team has a clear Howard University affiliation (student, alumni, faculty, or staff).
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="logoFile"
                  render={() => (
                    <FormItem>
                      <FormLabel>Business logo (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            form.setValue("logoFile", file);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Upload a square logo image to represent your business.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting your business...
                    </>
                  ) : (
                    "Submit business for review"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

