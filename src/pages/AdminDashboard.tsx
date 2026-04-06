import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { restGetJson, restPatchJson } from "@/integrations/amplify/restClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AuthButton from "@/components/AuthButton";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ShieldCheck } from "lucide-react";
import { useSession } from "@/features/auth/hooks/useSession";
import { getUrl } from "aws-amplify/storage";

type RequestRow = {
  id: string;
  business_profile_id: string;
  submitted_by: string;
  status: string;
  requests_minority_owned: boolean;
  requests_howard_affiliated: boolean;
  minority_document_path: string | null;
  howard_document_path: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  business_name: string;
  category: string;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const { session } = useSession();
  const userId = session?.user?.id;
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await restGetJson<RequestRow[]>("/verification_requests/pending");
      setRows(data ?? []);
    } catch (e) {
      toast({
        title: "Could not load requests",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
      setRows([]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const downloadDoc = async (path: string | null, label: string) => {
    if (!path) return;
    try {
      const { url } = await getUrl({ path });
      const a = document.createElement("a");
      a.href = url.toString();
      a.download = `${label}-${path.split("/").pop() ?? "file"}`;
      a.click();
    } catch (e) {
      toast({ title: "Download failed", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    }
  };

  const decide = async (id: string, status: "approved" | "rejected") => {
    if (!userId) return;
    setActingId(id);
    const payload = {
      status,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      admin_notes: notes[id]?.trim() || null,
      rejection_reason: status === "rejected" ? rejectReason[id]?.trim() || null : null,
    };

    try {
      await restPatchJson(`/verification_requests/${id}`, payload);
      toast({
        title: status === "approved" ? "Approved" : "Rejected",
        description: "Verification request updated.",
      });
      void load();
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    }
    setActingId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Admin — Verification</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/"><Button variant="ghost">Home</Button></Link>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending verification requests</CardTitle>
            <CardDescription>
              Review documents and approve or reject each submission.
            </CardDescription>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No pending requests.</p>
        ) : (
          <div className="space-y-6">
            {rows.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{r.business_name}</CardTitle>
                  <CardDescription>
                    {r.category} · Requested:{" "}
                    {[r.requests_minority_owned && "Minority-owned", r.requests_howard_affiliated && "Howard-affiliated"]
                      .filter(Boolean)
                      .join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {r.minority_document_path && (
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => void downloadDoc(r.minority_document_path, "minority")}>
                        <Download className="h-4 w-4 mr-2" />Minority document
                      </Button>
                    )}
                    {r.howard_document_path && (
                      <Button type="button" variant="outline" size="sm"
                        onClick={() => void downloadDoc(r.howard_document_path, "howard")}>
                        <Download className="h-4 w-4 mr-2" />Howard document
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`notes-${r.id}`}>Admin notes (optional)</Label>
                    <Textarea id={`notes-${r.id}`} value={notes[r.id] ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="Internal notes" rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`reject-${r.id}`}>Rejection reason (optional)</Label>
                    <Textarea id={`reject-${r.id}`} value={rejectReason[r.id] ?? ""}
                      onChange={(e) => setRejectReason((prev) => ({ ...prev, [r.id]: e.target.value }))}
                      placeholder="Reason for rejection" rows={2} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => void decide(r.id, "approved")} disabled={actingId === r.id}>
                      {actingId === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                    </Button>
                    <Button variant="destructive" onClick={() => void decide(r.id, "rejected")} disabled={actingId === r.id}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
