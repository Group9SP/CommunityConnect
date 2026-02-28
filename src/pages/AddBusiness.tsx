import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthButton from "@/components/AuthButton";
import { Link } from "react-router-dom";

const businessFormSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters."),
  category: z.string().min(2, "Category is required."),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price_level: z.string().transform((val) => (val ? Number(val) : 1)),
  languages: z.string().optional(), // Comma separated for now
  is_minority_owned: z.boolean().default(false),
  is_howard_affiliated: z.boolean().default(false),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

const AddBusiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      business_name: "",
      category: "",
      description: "",
      address: "",
      phone: "",
      website: "",
      price_level: 1,
      languages: "",
      is_minority_owned: false,
      is_howard_affiliated: false,
    },
  });

  async function onSubmit(data: BusinessFormValues) {
    setIsSubmitting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to list a business.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Format languages string to array
      const languagesArray = data.languages
        ? data.languages.split(",").map((l) => l.trim()).filter((l) => l.length > 0)
        : [];

      const { error } = await supabase.from("business_profiles").insert({
        user_id: user.id,
        business_name: data.business_name,
        category: data.category,
        description: data.description || null,
        address: data.address || null,
        phone: data.phone || null,
        website: data.website || null,
        price_level: data.price_level,
        languages: languagesArray.length > 0 ? languagesArray : null,
        is_minority_owned: data.is_minority_owned,
        is_howard_affiliated: data.is_howard_affiliated,
        verification_status: "pending", // Default
      });

      if (error) throw error;

      // Invalidate the cache for businesses so the new one appears immediately
      await queryClient.invalidateQueries({ queryKey: ["businesses"] });

      toast({
        title: "Success!",
        description: "Your business has been listed successfully and is pending verification.",
      });
      navigate("/browse");
    } catch (error: unknown) {
      console.error("Error creating business profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to list your business. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">List Your Business</h1>
          <p className="text-center text-muted-foreground mb-8">
            Join the Community Connect platform to reach conscious consumers and grow your reach.
          </p>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. Heritage Boutiques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Restaurant">Restaurant</SelectItem>
                            <SelectItem value="Coffee & Tea">Coffee & Tea</SelectItem>
                            <SelectItem value="Fashion & Retail">Fashion & Retail</SelectItem>
                            <SelectItem value="Beauty & Wellness">Beauty & Wellness</SelectItem>
                            <SelectItem value="Professional Services">Professional Services</SelectItem>
                            <SelectItem value="Arts & Entertainment">Arts & Entertainment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price Level */}
                  <FormField
                    control={form.control}
                    name="price_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select price level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">$ (Inexpensive)</SelectItem>
                            <SelectItem value="2">$$ (Moderately Expensive)</SelectItem>
                            <SelectItem value="3">$$$ (Expensive)</SelectItem>
                            <SelectItem value="4">$$$$ (Very Expensive)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your business, mission, and what makes you unique."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. 123 Main St, Washington, DC 20001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Website */}
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Languages */}
                  <FormField
                    control={form.control}
                    name="languages"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Languages Spoken</FormLabel>
                        <FormControl>
                          <Input placeholder="English, Spanish, French (comma separated)" {...field} />
                        </FormControl>
                        <FormDescription>
                          List the languages spoken by your staff to help customers choose where they feel comfortable.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium text-lg">Community Tags</h3>

                  <FormField
                    control={form.control}
                    name="is_minority_owned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Minority-Owned Business
                          </FormLabel>
                          <FormDescription>
                            Check this if your business is at least 51% owned and operated by individuals from minority groups.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_howard_affiliated"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Howard University Affiliated
                          </FormLabel>
                          <FormDescription>
                            Check this if the business owner is a student, alumni, or faculty member of Howard University.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "List Business"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddBusiness;
