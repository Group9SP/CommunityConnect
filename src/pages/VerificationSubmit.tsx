import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restGetJson, restPostJson, restPatchJson } from "@/integrations/amplify/restClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthButton from "@/components/AuthButton";
import { useToast } from "@/hooks/use-toast";
import { useUserRoles } from "@/hooks/use-user-roles";
import { REQUIRED_DOCUMENTATION, VERIFICATION_TYPES } from "@/lib/verification";
import { buildPrivateDocumentPath, validateVerificationFile, verificationBucket } from "@/lib/verificationUpload";
import { Loader2, FileCheck } from "lucide-react";
import { useSession } from "@/features/auth/hooks/useSession";
import { uploadData } from "aws-amplify/storage";

type BpRow = {
  id: string;
  business_name: string;
  category: string;
  is_minority_owned: boolean | null;
  is_howard_affiliated: boolean | null;
};

export default function VerificationSubmit() {
  const { toast } = useToast();
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(true);
  const [bp, setBp] = useState<BpRow | null>(null);
  const { isBusinessOwner, loading: roleLoading } = useUserRoles(userId);

  const [setupName, setSetupName] = useState("");
  const [setupCategory, setSetupCategory] = useState("");
  const [setupMinority, setSetupMinority] = useState(false);
  const [setupHoward, setSetupHoward] = useState(false);
  const [creatingBp, setCreatingBp] = useState(false);

  const [reqMinority, setReqMinority] = useState(false);
  const [reqHoward, setReqHoward] = useState(false);
  const [fileMinority, setFileMinority] = useState<File | null>(null);
  const [fileHoward, setFileHoward] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingBlock, setPendingBlock] = useState(false);
  const [claimMinority, setClaimMinority] = useState(false);
  const [claimHoward, setClaimHoward] = useState(false);
  const [savingClaims, setSavingClaims] = useState(false);

  useEffect(() => {
    if (sessionLoading || roleLoading || !userId) return;

    const run = async () => {
      setLoading(true);
      try {
        const data = await restGetJson<BpRow>("/business_profiles/me");
        setBp(data);
        if (data?.id) {
          setClaimMinority(!!data.is_minority_owned);
          setClaimHoward(!!data.is_howard_affiliated);
          const pend = await restGetJson<{ id: string } | null>(
            `/verification_requests/pending/check?business_profile_id=${data.id}`
          );
          setPendingBlock(!!pend);
        }
      } catch (e) {
        toast({ title: "Error", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
        setBp(null);
      }
      setLoading(false);
    };

    void run();
  }, [userId, sessionLoading, roleLoading, toast]);

  const createBusinessProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !setupName.trim() || !setupCategory.trim()) {
      toast({ title: "Missing fields", description: "Name and category are required.", variant: "destructive" });
      return;
    }
    setCreatingBp(true);
    try {
      const data = await restPostJson<BpRow>("/business_profiles", {
        user_id: userId,
        business_name: setupName.trim(),
        category: setupCategory.trim(),
        is_minority_owned: setupMinority,
        is_howard_affiliated: setupHoward,
        verification_status: "pending",
        listing_visibility: "draft",
      });
      setBp(data);
      toast({ title: "Business profile created", description: "You can now submit verification documents." });
    } catch (e) {
      toast({ title: "Could not create profile", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    }
    setCreatingBp(false);
  };

  const submitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !bp) return;

    if (!reqMinority && !reqHoward) {
      toast({ title: "Select verification types", description: "Choose at least one type to verify.", variant: "destructive" });
      return;
    }
    if (reqMinority && !fileMinority) { toast({ title: "Minority document required", variant: "destructive" }); return; }
    if (reqHoward && !fileHoward) { toast({ title: "Howard document required", variant: "destructive" }); return; }

    for (const f of [fileMinority, fileHoward].filter(Boolean) as File[]) {
      const err = validateVerificationFile(f);
      if (err) { toast({ title: "Invalid file", description: err, variant: "destructive" }); return; }
    }

    setSubmitting(true);
    let minorityPath: string | null = null;
    let howardPath: string | null = null;

    try {
      if (reqMinority && fileMinority) {
        minorityPath = buildPrivateDocumentPath(userId, fileMinority);
        await uploadData({ path: `${verificationBucket}/${minorityPath}`, data: fileMinority, options: { contentType: fileMinority.type } }).result;
      }
      if (reqHoward && fileHoward) {
        howardPath = buildPrivateDocumentPath(userId, fileHoward);
        await uploadData({ path: `${verificationBucket}/${howardPath}`, data: fileHoward, options: { contentType: fileHoward.type } }).result;
      }

      await restPostJson("/verification_requests", {
        business_profile_id: bp.id,
        submitted_by: userId,
        status: "pending",
        requests_minority_owned: reqMinority,
        requests_howard_affiliated: reqHoward,
        minority_document_path: minorityPath,
        howard_document_path: howardPath,
      });

      toast({ title: "Submitted", description: "Your documents are pending review." });
      setPendingBlock(true);
      setReqMinority(false);
      setReqHoward(false);
      setFileMinority(null);
      setFileHoward(null);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Upload or submit failed", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const saveClaims = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bp) return;
    setSavingClaims(true);
    try {
      await restPatchJson(`/business_profiles/${bp.id}`, {
        is_minority_owned: claimMinority,
        is_howard_affiliated: claimHoward,
      });
      setBp({ ...bp, is_minority_owned: claimMinority, is_howard_affiliated: claimHoward });
      toast({ title: "Claims updated" });
    } catch (e) {
      toast({ title: "Could not update claims", description: e instanceof Error ? e.message : "Error", variant: "destructive" });
    }
    setSavingClaims(false);
  };

  if (!sessionLoading && !userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Sign in to submit verification documents.</p>
        <Link to="/auth"><Button>Sign in</Button></Link>
      </div>
    );
  }

  if (sessionLoading || loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isBusinessOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Only business accounts can submit verification.</p>
        <Link to="/"><Button variant="outline">Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold text-primary">Community Connect</Link>
          <AuthButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-lg space-y-8">
        <div className="flex items-center gap-2 text-lg font-medium">
          <FileCheck className="h-6 w-6" />
          Business verification
        </div>

        {!bp ? (
          <Card>
            <CardHeader>
              <CardTitle>Create your business profile</CardTitle>
              <CardDescription>Required before you can upload verification documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createBusinessProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bn">Business name</Label>
                  <Input id="bn" value={setupName} onChange={(e) => setSetupName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat">Category</Label>
                  <Input id="cat" value={setupCategory} onChange={(e) => setSetupCategory(e.target.value)} placeholder="e.g. Restaurant" required />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="sm" checked={setupMinority} onCheckedChange={(v) => setSetupMinority(!!v)} />
                  <Label htmlFor="sm">I claim minority-owned status</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="sh" checked={setupHoward} onCheckedChange={(v) => setSetupHoward(!!v)} />
                  <Label htmlFor="sh">I claim Howard University affiliation</Label>
                </div>
                <Button type="submit" disabled={creatingBp}>
                  {creatingBp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {!pendingBlock && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Your claims</CardTitle>
                  <CardDescription>Tell us what you want verified.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={saveClaims} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="cm" checked={claimMinority} onCheckedChange={(v) => setClaimMinority(!!v)} />
                      <Label htmlFor="cm">I claim minority-owned status</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="ch" checked={claimHoward} onCheckedChange={(v) => setClaimHoward(!!v)} />
                      <Label htmlFor="ch">I claim Howard University affiliation</Label>
                    </div>
                    <Button type="submit" size="sm" variant="secondary" disabled={savingClaims}>
                      {savingClaims ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save claims"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
            {pendingBlock ? (
              <Card>
                <CardHeader>
                  <CardTitle>Request in review</CardTitle>
                  <CardDescription>
                    You already have a pending verification request for {bp.business_name}. An admin will review it shortly.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upload documents</CardTitle>
                  <CardDescription>{bp.business_name} · Select which claims to verify and attach one file per type.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitVerification} className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Checkbox id="rm" checked={reqMinority} onCheckedChange={(v) => setReqMinority(!!v)} disabled={!bp.is_minority_owned} />
                        <div>
                          <Label htmlFor="rm">Verify minority-owned ({VERIFICATION_TYPES.MINORITY_OWNED})</Label>
                          <p className="text-sm text-muted-foreground">{REQUIRED_DOCUMENTATION.minority_owned}</p>
                          {!bp.is_minority_owned && (
                            <p className="text-xs text-amber-600 mt-1">Enable this claim on your business profile first.</p>
                          )}
                        </div>
                      </div>
                      {reqMinority && bp.is_minority_owned && (
                        <Input type="file" accept=".pdf,image/*" onChange={(e) => setFileMinority(e.target.files?.[0] ?? null)} />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Checkbox id="rh" checked={reqHoward} onCheckedChange={(v) => setReqHoward(!!v)} disabled={!bp.is_howard_affiliated} />
                        <div>
                          <Label htmlFor="rh">Verify Howard-affiliated ({VERIFICATION_TYPES.HOWARD_AFFILIATED})</Label>
                          <p className="text-sm text-muted-foreground">{REQUIRED_DOCUMENTATION.howard_affiliated}</p>
                          {!bp.is_howard_affiliated && (
                            <p className="text-xs text-amber-600 mt-1">Enable Howard affiliation on your business profile first.</p>
                          )}
                        </div>
                      </div>
                      {reqHoward && bp.is_howard_affiliated && (
                        <Input type="file" accept=".pdf,image/*" onChange={(e) => setFileHoward(e.target.files?.[0] ?? null)} />
                      )}
                    </div>

                    <Button type="submit" disabled={
                      submitting ||
                      (!reqMinority && !reqHoward) ||
                      (reqMinority && (!bp.is_minority_owned || !fileMinority)) ||
                      (reqHoward && (!bp.is_howard_affiliated || !fileHoward))
                    }>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
