import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Clock, ShieldAlert, ShieldOff, Check, X, Flag, LogOut } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { useSellers } from "@/hooks/queries/useSellers";
import { getSellerTier } from "@/lib/seller-eligibility";
import { adminLogout } from "@/lib/admin-auth";
import type { Seller, SellerVerificationTier } from "@/types/models";

export const Route = createFileRoute("/admin/sellers")({
  head: () => ({ meta: [{ title: "Seller Verification Queue — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminSellerQueue />
    </AdminGate>
  ),
});

function AdminSellerQueue() {
  const { data: sellers, isLoading } = useSellers();
  const [overrides, setOverrides] = useState<Record<string, SellerVerificationTier>>({});

  function setTier(id: string, tier: SellerVerificationTier) {
    setOverrides((prev) => ({ ...prev, [id]: tier }));
    toast.success(`Seller marked as "${tier}".`);
  }

  const withTier = (s: Seller) => overrides[s.id] ?? getSellerTier(s);

  return (
    <PhoneFrame>
      <TopBar
        title="Seller Verification Queue"
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
          Approve or flag sellers here. Only <span className="font-semibold text-gold">Verified</span>{" "}
          sellers with zero open disputes are shown to buyers.
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Loading sellers…</p>}

        <div className="space-y-3">
          {sellers?.map((s) => {
            const tier = withTier(s);
            return (
              <article key={s.id} className="rounded-2xl border border-border/40 bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.category} · {s.location ?? "No location set"}
                    </p>
                  </div>
                  <TierPill tier={tier} />
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTier(s.id, "verified")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-success/15 text-xs font-semibold text-success"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier(s.id, "flagged")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive/15 text-xs font-semibold text-destructive"
                  >
                    <Flag className="h-3.5 w-3.5" /> Flag
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier(s.id, "unverified")}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-muted-foreground"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}

function TierPill({ tier }: { tier: SellerVerificationTier }) {
  const config: Record<SellerVerificationTier, { icon: typeof BadgeCheck; label: string; className: string }> = {
    verified: { icon: BadgeCheck, label: "Verified", className: "bg-gold/10 text-gold" },
    pending: { icon: Clock, label: "Pending", className: "bg-muted text-muted-foreground" },
    flagged: { icon: ShieldAlert, label: "Flagged", className: "bg-destructive/15 text-destructive" },
    unverified: { icon: ShieldOff, label: "Unverified", className: "bg-surface-2 text-muted-foreground" },
  };
  const { icon: Icon, label, className } = config[tier];
  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${className}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
