import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User as UserIcon, ClipboardList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  // Track whether the current user has the admin role so we can surface admin-only UI.
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Whenever the authenticated user changes, refresh their roles to detect admin access.
    let isMounted = true;

    if (!user) {
      setIsAdmin(false);
      return () => {
        isMounted = false;
      };
    }

    const checkRoles = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!isMounted) return;

      if (error) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.some((r) => r.role === "admin") ?? false);
    };

    void checkRoles();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user) {
    return (
      <Button onClick={() => navigate("/auth")} variant="default">
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {user.user_metadata?.full_name || user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin/review")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Review queue
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
