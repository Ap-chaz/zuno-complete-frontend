import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isKycVerified, setKycIntent } from "@/lib/zuno-kyc";

/**
 * Wrap any transaction surface (create deal, pay, release, confirm, etc.).
 * If KYC is not verified, blocks rendering with a modal offering
 * Verify Now (→ /auth/kyc, then returns to this URL) or Cancel (→ fallback).
 */
export function KycGate({
  children,
  fallback = "/app",
}: {
  children: ReactNode;
  fallback?: string;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    const ok = isKycVerified();
    setVerified(ok);
    setReady(true);
  }, []);

  const handleVerify = () => {
    const intent =
      typeof window !== "undefined" ? window.location.pathname + window.location.search : fallback;
    setKycIntent(intent);
    navigate({ to: "/auth/kyc", search: { redirect: intent } as never });
  };

  const handleCancel = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      navigate({ to: fallback as never });
    }
  };

  if (!ready) return null;
  if (verified) return <>{children}</>;

  return (
    <AlertDialog open>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold sm:mx-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <AlertDialogTitle className="text-xl">Verify Your Identity</AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            To protect all users and comply with our security standards, identity verification
            (KYC) is required before you can perform transactions on ZUNO.
            <br />
            <br />
            Complete your KYC once to unlock all transaction features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleVerify}
            className="bg-gradient-gold text-gold-foreground shadow-gold hover:opacity-90"
          >
            Verify Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
