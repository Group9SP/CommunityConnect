import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordToggleField } from "@/components/PasswordToggleField";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { resetPassword } = await import("aws-amplify/auth");
      await resetPassword({ username: email });
      setStep("confirm");
      setMessage("A reset code has been sent to your email.");
    } catch (err: any) {
      setMessage(err.message || "Failed to send reset code.");
    }
    setLoading(false);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { confirmResetPassword } = await import("aws-amplify/auth");
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      setMessage("Password reset successful. You can now log in.");
      setTimeout(() => navigate("/auth"), 1500);
    } catch (err: any) {
      setMessage(err.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <form className="w-full max-w-md space-y-6 bg-white p-8 rounded shadow" onSubmit={step === "request" ? handleRequest : handleConfirm}>
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        {step === "request" ? (
          <>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              placeholder="Enter code from email"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            <PasswordToggleField
              id="password-reset-new"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword((s) => !s)}
              autoComplete="new-password"
              placeholder="New password"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}
        {message && <div className="text-center text-sm text-muted-foreground">{message}</div>}
        <Button type="button" variant="ghost" className="w-full" onClick={() => navigate("/auth")}>Back to Login</Button>
      </form>
    </div>
  );
}
