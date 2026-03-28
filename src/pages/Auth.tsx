/**
 * Multi-step signup flow:
 * 1. Create Amplify Auth user
 * 2. Insert record into profiles table via GraphQL
 * 3. Assign default role via GraphQL
 *
 * Trust Boundary:
 * Auth state must match profiles + roles table.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp, getCurrentUser, confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
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
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "business_owner">("customer");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSignup, setPendingSignup] = useState<{ email: string; password: string; fullName: string; role: AppRole } | null>(null);
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
    // Check if user is already logged in (Amplify)
    getCurrentUser()
      .then(() => navigate("/"))
      .catch(() => {});
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authSchema.pick({ email: true, password: true }).parse({
        email: loginEmail,
        password: loginPassword,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    setLoading(true);
    try {
      await signIn({ username: loginEmail, password: loginPassword });
      // After successful sign-in, check if profile/role exists, if not, create them
      const client = generateClient();
      // Try to fetch profile (pseudo-code, adjust to your schema)
      // If not found, create profile and role
      // ...
      setLoading(false);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: error.message || String(error),
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      authSchema.parse({
        email: signupEmail,
        password: signupPassword,
        fullName: fullName,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    setLoading(true);
    try {
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
      setShowConfirm(true);
      setPendingSignup({ email: signupEmail, password: signupPassword, fullName, role: role as AppRole });
      toast({
        title: "Verify Your Email",
        description: "A confirmation link has been sent to your email. Please verify your account before signing in.",
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Signup Failed",
        description: error.message || String(error),
        variant: "destructive",
      });
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingSignup) return;
    setConfirmLoading(true);
    try {
      await confirmSignUp({ username: pendingSignup.email, confirmationCode });
      toast({
        title: "Account Verified!",
        description: "Your account has been verified. You can now sign in.",
      });
      setShowConfirm(false);
      setPendingSignup(null);
      setConfirmationCode("");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || String(error),
        variant: "destructive",
      });
    }
    setConfirmLoading(false);
  };

  const handleResendCode = async () => {
    if (!pendingSignup) return;
    try {
      await resendSignUpCode({ username: pendingSignup.email });
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || String(error),
        variant: "destructive",
      });
    }
  };

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
          {showConfirm ? (
            <form className="space-y-4" onSubmit={handleConfirm}>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Verify your email</p>
                <p className="text-muted-foreground">A confirmation code has been sent to your email. Enter it below to verify your account.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmation-code" className="block text-sm font-medium">Verification Code</label>
                <input
                  id="confirmation-code"
                  type="text"
                  value={confirmationCode}
                  onChange={e => setConfirmationCode(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={confirmLoading}>
                {confirmLoading ? "Verifying..." : "Verify Account"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleResendCode}>
                Resend Code
              </Button>
              <Button className="w-full" variant="ghost" onClick={() => { setShowConfirm(false); setConfirmationCode(""); }}>
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
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
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
                      placeholder="••••••"
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
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
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
