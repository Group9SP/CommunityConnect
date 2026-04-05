import { z } from "zod";

const fileOrNull = z
  .instanceof(File)
  .optional()
  .nullable()
  .or(z.any().transform(() => null));

function optionalTrimmedUrl(val: string | undefined): string | undefined {
  const s = val?.trim();
  if (!s) return undefined;
  try {
    void new URL(s);
    return s;
  } catch {
    return undefined;
  }
}

const businessFormObjectSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters").max(200),
  category: z.string().min(2, "Category is required").max(120),
  description: z.string().max(1000, "Description is too long").optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  hours: z.string().max(1000).optional().or(z.literal("")),
  price_level: z.coerce.number().int().min(1).max(4).default(2),
  languages: z.string().default("English"),
  is_minority_owned: z.boolean().default(false),
  is_howard_affiliated: z.boolean().default(false),
  logoFile: fileOrNull,
});

function refinePhoneAndWebsite<T extends z.infer<typeof businessFormObjectSchema>>(
  data: T,
  ctx: z.RefinementCtx
) {
  const phone = data.phone?.trim() ?? "";
  if (phone && !/^[\d+\s().-]+$/.test(phone)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid phone number",
      path: ["phone"],
    });
  }
  const web = data.website?.trim() ?? "";
  if (web && optionalTrimmedUrl(web) === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter a valid URL",
      path: ["website"],
    });
  }
}

/** Fields shared by add + edit business forms (F4.1.2 required vs optional). */
export const businessFormFieldsSchema = businessFormObjectSchema.superRefine(refinePhoneAndWebsite);

export const addBusinessSchema = businessFormObjectSchema
  .extend({
    verification_attestation: z.boolean().refine((val) => val === true, {
      message: "Confirm that your information is accurate and you agree to verification review.",
    }),
  })
  .superRefine(refinePhoneAndWebsite);

export type AddBusinessFormValues = z.infer<typeof addBusinessSchema>;

export const editBusinessSchema = businessFormFieldsSchema;

export type EditBusinessFormValues = z.infer<typeof editBusinessSchema>;
