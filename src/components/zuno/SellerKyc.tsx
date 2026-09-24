import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, ShieldCheck } from "lucide-react";
import { KycRequiredDialog } from "@/components/zuno/KycRequiredDialog";
import { getKycStatus, hasSeenKycPrompt, markKycPromptSeen, type KycStatus } from "@/lib/zuno-kyc";

/** Reads the signed-in user's KYC status after mount (localStorage isn't available during SSR). */
export function useKycStatus(): KycStatus | null {
  const [status, setStatus] = useState<KycStatus | null>(null);
  useEffect(() => setStatus(getKycStatus()), []);
  return status;
}

/**
 * Persistent reminder at the top of the seller dashboard until identity
 * verification is done. Hidden once verified.
 */
export function SellerKycBanner() {
  const status = useKycStatus();
  if (status === null || status === "verified") return null;

  if (status === "pending") {
    return (
      <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/5 p-3 sm:p-4 lg:mx-0">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
          <Clock className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">Identity verification in review</p>
          <p className="text-xs text-muted-foreground">Usually under 24 hours. You can receive payments once it's approved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/5 p-3 sm:p-4 lg:mx-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold sm:h-11 sm:w-11 sm:rounded-2xl">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-snug">Verify your identity to get paid</p>
        <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
          You can look around now, but you'll need to verify before marking orders shipped or receiving payouts.
        </p>
      </div>
      <Link
        to="/auth/kyc"
        search={{ redirect: "/seller" } as never}
        className="flex h-9 shrink-0 items-center justify-center rounded-xl bg-gradient-gold px-4 text-xs font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95 sm:h-10 sm:px-6 sm:text-sm"
      >
        Verify
      </Link>
    </div>
  );
}

/**
 * One-time welcome prompt shown the first time an unverified seller lands on
 * their dashboard after signing up. Dismissing it is fine — the banner keeps
 * reminding them and the money actions stay locked until they verify.
 */
export function SellerKycWelcome() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getKycStatus() === "unverified" && !hasSeenKycPrompt()) setOpen(true);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) markKycPromptSeen();
    setOpen(next);
  };

  return (
    <KycRequiredDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Welcome to ZUNO! Verify to get paid"
      description="Sellers verify their identity the same way buyers do. It takes a few minutes, protects you and your customers, and is required before you can ship orders or receive payouts."
      cancelLabel="Later"
    />
  );
}
