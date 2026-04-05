import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateClient } from "aws-amplify/api";
import { listBusinessProfiles } from "@/graphql/queries";
import { updateBusinessProfile, deleteBusinessProfile } from "@/graphql/mutations";
import { VerificationStatus } from "@/API";

export default function OwnerDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const client = generateClient();
      // Fetch only businesses owned by the current user (assumes owner field is set)
      const res: any = await client.graphql({
        query: listBusinessProfiles,
        variables: { filter: { /* Optionally filter by owner */ } },
      });
      setBusinesses(res.data.listBusinessProfiles.items);
      setLoading(false);
    };
    fetchBusinesses();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/dashboard/edit-business/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;
    setLoading(true);
    const client = generateClient();
    await client.graphql({
      query: deleteBusinessProfile,
      variables: { input: { id } },
    });
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    setLoading(false);
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    setLoading(true);
    const client = generateClient();
    const status = visible ? VerificationStatus.verified : VerificationStatus.pending;
    await client.graphql({
      query: updateBusinessProfile,
      variables: { input: { id, verification_status: status } },
    });
    setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, verification_status: status } : b));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>My Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading…</div>
          ) : businesses.length === 0 ? (
            <div>No businesses found.</div>
          ) : (
            <div className="space-y-6">
              {businesses.map((b) => (
                <div key={b.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-semibold">{b.business_name}</div>
                    <div className="text-sm text-muted-foreground">Category: {b.category}</div>
                    <div className="text-xs mt-1">Status: <span className={b.is_published ? "text-green-600" : "text-yellow-600"}>{b.is_published ? "Published" : "Draft"}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(b.id)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleVisibility(b.id, !b.is_published)}>
                      {b.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(b.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
