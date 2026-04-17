import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getBusinessProfileForUser } from "@/integrations/amplify/businessProfiles";
import { useSession } from "@/features/auth/hooks/useSession";

export default function MyBusinessHub() {
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSession();

  const { data, isFetched } = useQuery({
    queryKey: ["my-business", session?.user.id],
    queryFn: () => getBusinessProfileForUser(session!.user.id),
    enabled: !!session?.user.id && !sessionLoading,
  });

  useEffect(() => {
    if (sessionLoading) return;
    if (!session) { navigate("/auth", { replace: true }); return; }
    if (!isFetched) return;
    if (data && !data.deleted_at) {
      navigate(`/business/${data.id}/manage`, { replace: true });
    } else {
      navigate("/business/add", { replace: true });
    }
  }, [session, sessionLoading, data, isFetched, navigate]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
