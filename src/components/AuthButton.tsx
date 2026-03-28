import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAuthSession, signOut, getCurrentUser } from "aws-amplify/auth";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get current user from Amplify Auth
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));

    // Listen for auth changes (Amplify Hub)
    const listener = (data: any) => {
      switch (data.payload.event) {
        case 'signedIn':
          getCurrentUser().then(setUser);
          break;
        case 'signedOut':
          setUser(null);
          break;
        default:
          break;
      }
    };
    import('aws-amplify/utils').then(({ Hub }) => {
      Hub.listen('auth', listener);
    });
    return () => {
      // No explicit unsubscribe needed for Hub.listen
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setUser(null);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || String(error),
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
