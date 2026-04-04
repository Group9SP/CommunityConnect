import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { getBusinessProfileForUser } from "@/integrations/amplify/businessProfiles";
import { useSession } from "@/features/auth/hooks/useSession";

export default function MyBusinessHub() {
  const navigate = useNavigate();
  const { session } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["my-business", session?.user.id],
    queryFn: () => getBusinessProfileForUser(session!.user.id),
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    if (!session || isLoading) return;
    if (data && !data.deleted_at) {
      navigate(`/business/${data.id}/manage`, { replace: true });
    } else {
      navigate("/business/add", { replace: true });
    }
  }, [session, data, isLoading, navigate]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
