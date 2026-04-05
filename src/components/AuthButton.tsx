import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User as UserIcon, ClipboardList, Building2 } from "lucide-react";
import { LogOut, ShieldCheck, User as UserIcon, FileCheck } from "lucide-react";
import { useUserRoles } from "@/hooks/use-user-roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/integrations/amplify/authSession";
import { useSession } from "@/features/auth/hooks/useSession";
import { useHasRole } from "@/features/auth/hooks/useUserRoles";

export default function AuthButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSession();
  const user = session?.user ?? null;
  const { hasRole: isAdmin } = useHasRole(user?.id, "admin");
  const { hasRole: isBusinessOwner } = useHasRole(user?.id, "business_owner");
  const { isAdmin, isBusinessOwner } = useUserRoles(user?.id);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Sign out failed.";
      toast({
        title: "Logout Failed",
        description: message,
        variant: "destructive",
      });
    }
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
          {user.signInDetails?.loginId || user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin/review")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Review queue
          </DropdownMenuItem>
        )}
        {isBusinessOwner && (
          <DropdownMenuItem onClick={() => navigate("/owner/business")}>
            <Building2 className="mr-2 h-4 w-4" />
            My business
          </DropdownMenuItem>
        )}
        {isBusinessOwner && (
          <DropdownMenuItem onClick={() => navigate("/verification")}>
            <FileCheck className="mr-2 h-4 w-4" />
            Verification
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
