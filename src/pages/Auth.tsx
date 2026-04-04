/**
 * Multi-step signup flow:
 * 1. Create Amplify/Cognito Auth user
 * 2. Insert record into Profile table via GraphQL
 * 3. Assign default role in UserRole table via GraphQL
 *
 * Trust Boundary:
 * Auth state must match Profile + UserRole tables.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, confirmSignUp, getCurrentUser, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { createProfile, createUserRole } from "@/graphql/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "business_owner">("customer");

  // Confirmation step state
  const [pendingEmail, setPendingEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingFullName, setPendingFullName] = useState("");
  const [pendingRole, setPendingRole] = useState<"customer" | "business_owner">("customer");
  const [showConfirm, setShowConfirm] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then(() => navigate("/"))
      .catch(() => {/* not logged in */});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(1, "Please enter your password"),
      }).parse({ email: loginEmail, password: loginPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
        return;
      }
    }

    setLoading(true);

    try {
      // Clear any existing partial session before signing in
      await signOut().catch(() => {});
      await signIn({ username: loginEmail, password: loginPassword });
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast({ title: "Login Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      authSchema.parse({ email: signupEmail, password: signupPassword, fullName });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
        return;
      }
    }

    setLoading(true);

    try {
      await signOut().catch(() => {});
      const { userId } = await signUp({
        username: signupEmail,
        password: signupPassword,
        options: {
          userAttributes: {
            email: signupEmail,
            name: fullName,
          },
        },
      });

      setPendingEmail(signupEmail);
      setPendingUserId(userId ?? "");
      setPendingFullName(fullName);
      setPendingRole(role);
      setShowConfirm(true);

      toast({
        title: "Check your email",
        description: "Enter the confirmation code we sent you.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed";
      if (message.toLowerCase().includes("user already exists") || message.toLowerCase().includes("username exists")) {
        toast({ title: "Account already exists", description: "Please use the Login tab instead.", variant: "destructive" });
      } else {
        toast({ title: "Signup Failed", description: message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      try {
        await confirmSignUp({ username: pendingEmail, confirmationCode });
      } catch (confirmError: unknown) {
        const msg = confirmError instanceof Error ? confirmError.message : "";
        if (!msg.toLowerCase().includes("current status is confirmed")) throw confirmError;
        // Already confirmed — proceed to sign in
      }

      // Sign in to get auth tokens so GraphQL mutations can be made
      try {
        await signIn({ username: pendingEmail, password: signupPassword });
      } catch {
        // If auto sign-in fails, send to login page
        toast({ title: "Email confirmed!", description: "Please log in to continue." });
        setShowConfirm(false);
        return;
      }

      const client = generateClient();

      // Create Profile record
      await client.graphql({
        query: createProfile,
        variables: { input: { id: pendingUserId, full_name: pendingFullName } },
        authMode: "userPool",
      });

      // Create UserRole record
      await client.graphql({
        query: createUserRole,
        variables: { input: { profileID: pendingUserId, role: pendingRole } },
        authMode: "userPool",
      });

      toast({ title: "Account Created!", description: "Welcome! Your account has been created successfully." });
      navigate("/");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Confirmation failed";
      toast({ title: "Confirmation Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Confirm your email</CardTitle>
            <CardDescription className="text-center">
              Enter the code sent to {pendingEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConfirm} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Confirmation Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirming...</> : "Confirm"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Community Marketplace
          </CardTitle>
          <CardDescription className="text-center">
            Supporting minority-owned and Howard-affiliated businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <RadioGroup value={role} onValueChange={(value) => setRole(value as "customer" | "business_owner")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer" className="font-normal cursor-pointer">
                        Customer - I want to discover and support businesses
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="business_owner" id="business_owner" />
                      <Label htmlFor="business_owner" className="font-normal cursor-pointer">
                        Business Owner - I want to list my business
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
