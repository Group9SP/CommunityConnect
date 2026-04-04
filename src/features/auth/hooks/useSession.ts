import { useEffect, useState } from "react";

import { getAppSession, subscribeAuth, type AppSession } from "@/integrations/amplify/authSession";

type UseSessionResult = {
  session: AppSession | null;
  loading: boolean;
};

export function useSession(): UseSessionResult {
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const refresh = () => {
      getAppSession()
        .then((next) => {
          if (!isMounted) return;
          setSession(next);
          setLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setSession(null);
          setLoading(false);
        });
    };

    refresh();
    const unsubscribe = subscribeAuth(refresh);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { session, loading };
}
