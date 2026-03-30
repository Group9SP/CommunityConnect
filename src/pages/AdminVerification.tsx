import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateClient } from "aws-amplify/api";
import { listBusinessProfiles } from "@/graphql/queries";
import { updateBusinessProfile } from "@/graphql/mutations";
import { VerificationStatus } from "@/API";

export default function AdminVerification() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const client = generateClient();
      const res: any = await client.graphql({
        query: listBusinessProfiles,
        variables: { filter: { verification_status: { eq: VerificationStatus.pending } } },
      });
      setRequests(res.data.listBusinessProfiles.items);
    };
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: VerificationStatus.verified | VerificationStatus.rejected) => {
    const client = generateClient();
    await client.graphql({
      query: updateBusinessProfile,
      variables: { input: { id, verification_status: action } },
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div>No pending requests.</div>
          ) : (
            <div className="space-y-6">
              {requests.map((req) => (
                <div key={req.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-semibold">{req.business_name}</div>
                    <div className="text-sm text-muted-foreground">Owner: {req.owner}</div>
                    {req.verification_document_url && (
                      <a href={req.verification_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View Document</a>
                    )}
                    <div className="text-xs mt-1">
                      Status: <span className={
                        req.verification_status === VerificationStatus.pending ? "text-yellow-600" :
                        req.verification_status === VerificationStatus.verified ? "text-green-600" : "text-red-600"
                      }>{req.verification_status}</span>
                    </div>
                  </div>
                  {req.verification_status === VerificationStatus.pending && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAction(req.id, VerificationStatus.verified)}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(req.id, VerificationStatus.rejected)}>Reject</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
