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
import { signIn, signUp, getCurrentUser, confirmSignUp, resendSignUpCode, signOut } from "aws-amplify/auth";
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
import type { AppRole } from '@/API';

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
  const [showConfirm, setShowConfirm] = useState(() => !!sessionStorage.getItem("pendingSignup"));
  const [pendingSignup, setPendingSignup] = useState<{ email: string; password: string; fullName: string; role: AppRole } | null>(() => {
    const stored = sessionStorage.getItem("pendingSignup");
    return stored ? JSON.parse(stored) : null;
  });
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      .catch(() => {});
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
      setLoading(false);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      toast({ title: "Login Failed", description: error.message || String(error), variant: "destructive" });
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
      await signUp({
        username: signupEmail,
        password: signupPassword,
        options: {
          userAttributes: {
            email: signupEmail,
            name: fullName,
          },
        },
      });
      setLoading(false);
      const signup = { email: signupEmail, password: signupPassword, fullName, role: role as AppRole };
      setPendingSignup(signup);
      sessionStorage.setItem("pendingSignup", JSON.stringify(signup));
      setShowConfirm(true);
      toast({
        title: "Check your email",
        description: "Enter the confirmation code we sent you.",
      });
    } catch (error: any) {
      setLoading(false);
      if (error.message?.toLowerCase().includes("user already exists") || error.message?.toLowerCase().includes("username exists")) {
        toast({ title: "Account already exists", description: "Please use the Login tab instead.", variant: "destructive" });
      } else {
        toast({ title: "Signup Failed", description: error.message || String(error), variant: "destructive" });
      }
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingSignup) return;
    setConfirmLoading(true);
    try {
      try {
        await confirmSignUp({ username: pendingSignup.email, confirmationCode });
      } catch (confirmError: any) {
        const msg = confirmError?.message ?? "";
        if (!msg.toLowerCase().includes("current status is confirmed")) throw confirmError;
      }

      await signIn({ username: pendingSignup.email, password: pendingSignup.password });

      const client = generateClient();
      const profileResult: any = await client.graphql({
        query: createProfile,
        variables: { input: { full_name: pendingSignup.fullName } },
      });
      const profileId = profileResult.data.createProfile.id;
      await client.graphql({
        query: createUserRole,
        variables: { input: { profileID: profileId, role: pendingSignup.role } },
      });

      toast({ title: "Account Verified!", description: "Your account has been verified and you are now signed in." });
      setShowConfirm(false);
      setPendingSignup(null);
      sessionStorage.removeItem("pendingSignup");
      setConfirmationCode("");
      navigate("/");
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message || String(error), variant: "destructive" });
    }
    setConfirmLoading(false);
  };

  const handleResendCode = async () => {
    if (!pendingSignup) return;
    try {
      await resendSignUpCode({ username: pendingSignup.email });
      toast({ title: "Code Resent", description: "A new verification code has been sent to your email." });
    } catch (error: any) {
      toast({ title: "Resend Failed", description: error.message || String(error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Community Marketplace</CardTitle>
          <CardDescription className="text-center">
            Supporting minority-owned and Howard-affiliated businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showConfirm ? (
            <form className="space-y-4" onSubmit={handleConfirm}>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Verify your email</p>
                <p className="text-muted-foreground">Enter the confirmation code sent to {pendingSignup?.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-code">Verification Code</Label>
                <Input
                  id="confirmation-code"
                  type="text"
                  placeholder="123456"
                  value={confirmationCode}
                  onChange={e => setConfirmationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={confirmLoading}>
                {confirmLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify Account"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleResendCode}>
                Resend Code
              </Button>
              <Button type="button" className="w-full" variant="ghost" onClick={() => {
                setShowConfirm(false);
                setConfirmationCode("");
                sessionStorage.removeItem("pendingSignup");
                setPendingSignup(null);
              }}>
                Back to Login
              </Button>
            </form>
          ) : (
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
                  <Button type="button" variant="link" className="w-full mt-2" onClick={() => navigate("/password-reset")}>
                    Forgot password?
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
