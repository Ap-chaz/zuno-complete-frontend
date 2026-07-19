import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Reset password — ZUNO" }] }),
  component: Forgot,
});

function Forgot() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!identifier.trim()) {
      setError("Enter your phone number or email");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(identifier);
      setSent(true);
      toast.success("Reset code sent — check your email or SMS.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send the reset code. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PhoneFrame>
      <TopBar title="Forgot Password" back="/auth/login" />
      <div className="flex flex-1 flex-col px-6 pt-6">
        {sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="text-base font-semibold">Check your inbox</p>
            <p className="max-w-[26ch] text-sm text-muted-foreground">
              We sent a reset code to <span className="font-medium text-foreground">{identifier}</span>. It expires in 10 minutes.
            </p>
            <Link
              to="/auth/login"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold"
            >
              Back to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Enter your registered phone number or email and we'll send a reset code.
            </p>
            <label
              className={`mt-6 flex h-14 items-center gap-3 rounded-2xl border bg-input px-4 transition-colors focus-within:border-gold/50 ${
                error ? "border-destructive/60" : "border-border/60"
              }`}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Phone Number or Email"
                aria-invalid={Boolean(error)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            {error && <p className="mt-1 pl-1 text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-auto mb-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-base font-semibold text-gold-foreground shadow-gold transition-opacity disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Reset Code
            </button>
          </form>
        )}
      </div>
    </PhoneFrame>
  );
}
