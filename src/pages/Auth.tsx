/**
 * Sign-up with Cognito email verification when the user pool requires it,
 * then REST profile + role creation.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "aws-amplify/auth";
import {
  confirmEmailCodeAndSignIn,
  getAppSession,
  resendVerificationEmail,
  resolveDisplayNameForNewProfile,
  signUpThenEnsureProfileAndRole,
} from "@/integrations/amplify/authSession";
import { insertProfile, insertUserRole } from "@/integrations/amplify/userDirectory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const PENDING_SIGNUP_KEY = "communityConnectPendingSignup";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
});

type VerifyContext = "signup" | "login";

function isUnconfirmedUserError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error && typeof (error as { name: string }).name === "string" ? (error as { name: string }).name : "";
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  return (
    name === "UserNotConfirmedException" ||
    (name === "NotAuthorizedException" && lower.includes("not confirmed")) ||
    lower.includes("user is not confirmed")
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "business_owner">("customer");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [verifyContext, setVerifyContext] = useState<VerifyContext>("signup");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getAppSession().then((session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const verificationEmail = verifyContext === "login" ? loginEmail : signupEmail;
  const verificationPassword = verifyContext === "login" ? loginPassword : signupPassword;

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
      const out = await signIn({ username: loginEmail, password: loginPassword });
      setLoading(false);

      if (!out.isSignedIn) {
        toast({
          title: "Login Failed",
          description: "Additional sign-in steps may be required for this account.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (error: unknown) {
      setLoading(false);
      if (isUnconfirmedUserError(error)) {
        setVerifyContext("login");
        setShowVerifyEmail(true);
        setConfirmationCode("");
        toast({
          title: "Confirm your email",
          description: "Enter the verification code we sent you, then you can sign in.",
        });
        return;
      }
      const message = error instanceof Error ? error.message : "Login failed.";
      toast({
        title: "Login Failed",
        description: message,
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

    let result: Awaited<ReturnType<typeof signUpThenEnsureProfileAndRole>>;
    try {
      result = await signUpThenEnsureProfileAndRole(
        {
          email: signupEmail,
          password: signupPassword,
          fullName,
          role,
        },
        async (userId) => {
          await insertProfile(userId, fullName);
          await insertUserRole(userId, role);
        }
      );
    } catch (error: unknown) {
      setLoading(false);
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
      return;
    }

    setLoading(false);

    if ("needsEmailConfirmation" in result && result.needsEmailConfirmation) {
      try {
        sessionStorage.setItem(
          PENDING_SIGNUP_KEY,
          JSON.stringify({
            email: signupEmail,
            fullName,
            role,
          })
        );
      } catch {
        // ignore storage errors
      }
      setVerifyContext("signup");
      setShowVerifyEmail(true);
      setConfirmationCode("");
      toast({
        title: "Check your email",
        description: "We sent a verification code. Enter it below to finish creating your account.",
      });
      return;
    }

    if ("error" in result && result.error) {
      toast({
        title: "Signup Failed",
        description: result.error.message,
        variant: "destructive",
      });
      return;
    }

    if (result.ok) {
      try {
        sessionStorage.removeItem(PENDING_SIGNUP_KEY);
      } catch {
        // ignore
      }
      toast({
        title: "Account Created!",
        description: "Welcome! Your account has been created successfully.",
      });
      navigate("/");
    }
  };

  const handleConfirmVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationEmail.trim()) {
      toast({
        title: "Missing email",
        description: "Go back and enter the email you signed up with.",
        variant: "destructive",
      });
      return;
    }
    if (!verificationPassword) {
      toast({
        title: "Password required",
        description: verifyContext === "login"
          ? "Your password is needed after verification."
          : "Use the same password you chose when signing up.",
        variant: "destructive",
      });
      return;
    }

    setConfirmLoading(true);
    try {
      const signedIn = await confirmEmailCodeAndSignIn(
        verificationEmail.trim(),
        verificationPassword,
        confirmationCode
      );
      if (!signedIn.ok) {
        toast({
          title: "Verification failed",
          description: signedIn.error.message,
          variant: "destructive",
        });
        return;
      }

      const session = await getAppSession();
      if (!session?.user.id) {
        toast({
          title: "Signed in",
          description: "You are signed in but we could not load your profile. Try refreshing.",
          variant: "destructive",
        });
        return;
      }

      let profileFullName = fullName;
      let profileRole = role;
      try {
        const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
        if (raw) {
          const pending = JSON.parse(raw) as {
            email?: string;
            fullName?: string;
            role?: "customer" | "business_owner";
          };
          if (pending.email === verificationEmail.trim()) {
            if (pending.fullName) profileFullName = pending.fullName;
            if (pending.role) profileRole = pending.role;
          }
        }
      } catch {
        // ignore
      }

      if (!profileFullName.trim()) {
        profileFullName = await resolveDisplayNameForNewProfile(verificationEmail.trim());
      }

      try {
        await insertProfile(session.user.id, profileFullName);
        await insertUserRole(session.user.id, profileRole);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Could not save your profile.";
        toast({
          title: "Profile setup",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      try {
        sessionStorage.removeItem(PENDING_SIGNUP_KEY);
      } catch {
        // ignore
      }

      setShowVerifyEmail(false);
      setConfirmationCode("");
      toast({
        title: "Welcome!",
        description: "Your email is verified and your account is ready.",
      });
      navigate("/");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!verificationEmail.trim()) return;
    try {
      await resendVerificationEmail(verificationEmail.trim());
      toast({
        title: "Code sent",
        description: "Check your inbox for a new verification code.",
      });
    } catch (error: unknown) {
      toast({
        title: "Could not resend",
        description: error instanceof Error ? error.message : "Try again later.",
        variant: "destructive",
      });
    }
  };

  const handleBackFromVerification = () => {
    setShowVerifyEmail(false);
    setConfirmationCode("");
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
          {showVerifyEmail ? (
            <form className="space-y-4" onSubmit={handleConfirmVerification}>
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Verify your email</p>
                <p className="text-sm text-muted-foreground">
                  Enter the code we sent to{" "}
                  <span className="font-medium text-foreground">{verificationEmail || "your email"}</span>.
                  {verifyContext === "login" ? (
                    <>
                      {" "}
                      Re-enter your password under the code so we can sign you in after verification.
                    </>
                  ) : (
                    <>
                      {" "}
                      After verification you will be signed in with the password you chose on the sign-up form.
                    </>
                  )}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-code">Verification code</Label>
                <Input
                  id="confirmation-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
              </div>
              {verifyContext === "login" ? (
                <div className="space-y-2">
                  <Label htmlFor="verify-login-password">Password</Label>
                  <Input
                    id="verify-login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              ) : null}
              <Button type="submit" className="w-full" disabled={confirmLoading}>
                {confirmLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify and continue"
                )}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleResendCode}>
                Resend code
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={handleBackFromVerification}>
                Back to sign in
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
