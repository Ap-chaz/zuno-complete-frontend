import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { BadgeCheck, Clock, ShieldOff, LogOut, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { adminLogout } from "@/lib/admin-auth";
import { useBuyers, useSetBuyerKycStatus } from "@/hooks/queries/useBuyers";
import type { BuyerSummary, KycStatus } from "@/types/models";

export const Route = createFileRoute("/admin/kyc")({
  head: () => ({ meta: [{ title: "KYC & Compliance — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminKyc />
    </AdminGate>
  ),
});

// NOTE: there's no real per-user KYC submission (ID photo, selfie) to review
// for anyone but the currently logged-in browser — this queue works off the
// same derived buyer directory as Buyer Accounts. Once a real backend
// exists, this becomes a real document review queue instead of a status list.
function AdminKyc() {
  const { data: buyers, isLoading } = useBuyers();

  const pending = useMemo(() => buyers?.filter((b) => b.kycStatus === "pending") ?? [], [buyers]);
  const resolved = useMemo(() => buyers?.filter((b) => b.kycStatus !== "pending") ?? [], [buyers]);

  return (
    <PhoneFrame>
      <TopBar
        title="KYC & Compliance"
        back="/admin"
        right={
          <button
            type="button"
            onClick={() => {
              adminLogout();
              window.location.reload();
            }}
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-muted-foreground hover:bg-surface-2"
            aria-label="Log out of admin"
          >
            <LogOut className="h-4 w-4" />
          </button>
        }
      />

      <div className="px-5 pt-4 pb-8">
        <p className="mb-4 text-xs text-muted-foreground">
          Approve or reject pending identity verification. Rejected buyers can resubmit.
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

        <p className="mb-2 text-xs font-bold tracking-[0.18em] text-muted-foreground">PENDING REVIEW</p>
        <div className="space-y-2">
          {pending.map((b) => (
            <KycRow key={b.name} buyer={b} />
          ))}
          {!isLoading && pending.length === 0 && (
            <p className="rounded-xl bg-surface p-3 text-center text-xs text-muted-foreground">
              Nothing pending review.
            </p>
          )}
        </div>

        {resolved.length > 0 && (
          <>
            <p className="mb-2 mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">ALL BUYERS</p>
            <div className="space-y-2">
              {resolved.map((b) => (
                <KycRow key={b.name} buyer={b} />
              ))}
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function KycRow({ buyer: b }: { buyer: BuyerSummary }) {
  const setStatus = useSetBuyerKycStatus();

  function handleSet(status: KycStatus) {
    setStatus.mutate(
      { name: b.name, status },
      {
        onSuccess: () => toast.success(`${b.name} marked as ${status}.`),
        onError: () => toast.error("Couldn't update KYC status."),
      },
    );
  }

  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-surface p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{b.name}</p>
        <p className="text-xs text-muted-foreground">
          {b.transactionCount} transaction{b.transactionCount === 1 ? "" : "s"}
        </p>
      </div>

      {b.kycStatus === "pending" ? (
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            disabled={setStatus.isPending}
            onClick={() => handleSet("verified")}
            className="flex h-8 items-center gap-1 rounded-lg bg-success/15 px-2.5 text-xs font-semibold text-success disabled:opacity-50"
          >
            {setStatus.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Approve
          </button>
          <button
            type="button"
            disabled={setStatus.isPending}
            onClick={() => handleSet("unverified")}
            className="flex h-8 items-center gap-1 rounded-lg bg-destructive/15 px-2.5 text-xs font-semibold text-destructive disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </button>
        </div>
      ) : (
        <KycPill status={b.kycStatus} />
      )}
    </article>
  );
}

function KycPill({ status }: { status: KycStatus }) {
  const config = {
    verified: { icon: BadgeCheck, label: "Verified", className: "bg-success/15 text-success" },
    pending: { icon: Clock, label: "Pending", className: "bg-gold/10 text-gold" },
    unverified: { icon: ShieldOff, label: "Unverified", className: "bg-surface-2 text-muted-foreground" },
  }[status];
  const Icon = config.icon;
  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.className}`}>
      <Icon className="h-3 w-3" /> {config.label}
    </span>
  );
}
