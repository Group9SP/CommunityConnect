import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { generateClient } from "aws-amplify/api";
import { createBusinessProfile } from "@/graphql/mutations";
import { uploadData } from "aws-amplify/storage";

const businessSchema = z.object({
  business_name: z.string().min(2, "Business name required"),
  category: z.string().min(2, "Category required"),
  description: z.string().optional(),
  address: z.string().optional(),
  price_level: z.number().min(1).max(4),
  is_minority_owned: z.boolean(),
  is_howard_affiliated: z.boolean(),
});

export default function AddBusiness() {
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    description: "",
    address: "",
    price_level: 1,
    is_minority_owned: false,
    is_howard_affiliated: false,
    verification_types: [] as ("minority_owned" | "howard_affiliated")[],
    verification_document: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "verification_types") {
      setForm((prev) => {
        const arr = prev.verification_types.includes(value)
          ? prev.verification_types.filter((v) => v !== value)
          : [...prev.verification_types, value];
        return { ...prev, verification_types: arr };
      });
    } else if (name === "verification_document") {
      setForm((prev) => ({ ...prev, verification_document: files[0] }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      businessSchema.parse(form);
      if (form.verification_types.length > 0 && !form.verification_document) {
        setError("Verification document required for selected types.");
        return;
      }
      setLoading(true);
      let documentUrl = null;
      if (form.verification_document) {
        // Upload to Amplify Storage
        const file = form.verification_document;
        const key = `verification-docs/${Date.now()}_${file.name}`;
        await uploadData({ path: key, data: file, options: { contentType: file.type } }).result;
        documentUrl = key;
      }
      const client = generateClient();
      const input: any = {
        business_name: form.business_name,
        category: form.category,
        description: form.description,
        address: form.address,
        price_level: form.price_level,
        is_minority_owned: form.is_minority_owned,
        is_howard_affiliated: form.is_howard_affiliated,
        verification_status: form.verification_types.length > 0 ? "pending" : undefined,
        // Optionally add documentUrl to a custom field if schema allows
        verification_document_url: documentUrl,
      };
      await client.graphql({
        query: createBusinessProfile,
        variables: { input },
      });
      setLoading(false);
      setSuccess("Business created! Verification request submitted.");
      setForm({
        business_name: "",
        category: "",
        description: "",
        address: "",
        price_level: 1,
        is_minority_owned: false,
        is_howard_affiliated: false,
        verification_types: [],
        verification_document: null,
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Validation error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Business Name</Label>
              <Input name="business_name" value={form.business_name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Category</Label>
              <Input name="category" value={form.category} onChange={handleChange} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input name="description" value={form.description} onChange={handleChange} />
            </div>
            <div>
              <Label>Address</Label>
              <Input name="address" value={form.address} onChange={handleChange} />
            </div>
            <div>
              <Label>Price Level (1-4)</Label>
              <Input name="price_level" type="number" min={1} max={4} value={form.price_level} onChange={handleChange} required />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_minority_owned" checked={form.is_minority_owned} onChange={handleChange} />
                Minority-Owned
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_howard_affiliated" checked={form.is_howard_affiliated} onChange={handleChange} />
                Howard-Affiliated
              </label>
            </div>
            {/* Verification Section (F5.1.1–F5.1.3) */}
            <div className="border-t pt-4 mt-4">
              <Label className="font-semibold">Verification Request (optional)</Label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="verification_types"
                    value="minority_owned"
                    checked={form.verification_types.includes("minority_owned")}
                    onChange={handleChange}
                  />
                  Minority-Owned
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="verification_types"
                    value="howard_affiliated"
                    checked={form.verification_types.includes("howard_affiliated")}
                    onChange={handleChange}
                  />
                  Howard-Affiliated
                </label>
              </div>
              {form.verification_types.length > 0 && (
                <div className="mt-2">
                  <Label>Upload Verification Document</Label>
                  <Input
                    type="file"
                    name="verification_document"
                    accept="application/pdf,image/*"
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Add Business"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
