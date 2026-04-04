import type { Control, FieldValues, Path } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type BusinessListingFormFieldsProps<T extends FieldValues> = {
  control: Control<T>;
};

export function BusinessListingFormFields<T extends FieldValues>({ control }: BusinessListingFormFieldsProps<T>) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name={"business_name" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business name (required)</FormLabel>
              <FormControl>
                <Input placeholder="Community Cafe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"category" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (required)</FormLabel>
              <FormControl>
                <Input placeholder="Restaurant, Retail, Services…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={"description" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormDescription>Optional. Up to 1000 characters.</FormDescription>
            <FormControl>
              <Textarea
                placeholder="Share what makes your business special, and how you serve the community."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name={"address" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormDescription>Optional.</FormDescription>
              <FormControl>
                <Input placeholder="123 Main St, City, State" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"phone" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormDescription>Optional.</FormDescription>
              <FormControl>
                <Input placeholder="(555) 555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={"website" as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormDescription>Optional. Include https://</FormDescription>
            <FormControl>
              <Input placeholder="https://yourbusiness.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name={"price_level" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price level (1–4)</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={4} {...field} />
              </FormControl>
              <FormDescription>1 = budget-friendly, 4 = premium.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"languages" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages spoken</FormLabel>
              <FormDescription>Optional. Comma-separated.</FormDescription>
              <FormControl>
                <Input placeholder="English, Spanish, French" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name={"is_minority_owned" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Minority-owned business</FormLabel>
                <FormDescription>
                  This business is majority-owned by members of a historically marginalized group.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={"is_howard_affiliated" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(!!checked)} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Howard-affiliated business</FormLabel>
                <FormDescription>Howard University affiliation (student, alumni, faculty, or staff).</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={"logoFile" as Path<T>}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <FormItem>
            <FormLabel>Business logo</FormLabel>
            <FormDescription>Optional. Square image works best.</FormDescription>
            <FormControl>
              <Input
                ref={ref}
                name={name}
                onBlur={onBlur}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  onChange(file);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
