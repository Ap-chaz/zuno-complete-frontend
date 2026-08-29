import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, LogOut, Star, UserX, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { VerificationBadge } from "@/components/zuno/VerificationBadge";
import { adminLogout } from "@/lib/admin-auth";
import { useSellers, useToggleSellerSuspend } from "@/hooks/queries/useSellers";
import { getSellerTrustLabel } from "@/lib/seller-eligibility";
import type { Seller } from "@/types/models";

export const Route = createFileRoute("/admin/seller-accounts")({
  head: () => ({ meta: [{ title: "Seller Accounts — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminSellerAccounts />
    </AdminGate>
  ),
});

function AdminSellerAccounts() {
  const { data: sellers, isLoading } = useSellers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!sellers) return [];
    const q = query.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    );
  }, [sellers, query]);

  return (
    <PhoneFrame>
      <TopBar
        title="Seller Accounts"
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
        <div className="mb-3 flex items-center gap-2 rounded-2xl border border-border/60 bg-input px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or category…"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} seller${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="space-y-2">
          {filtered.map((s) => (
            <SellerRow key={s.id} seller={s} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No sellers match this search.</p>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function SellerRow({ seller: s }: { seller: Seller }) {
  const toggleSuspend = useToggleSellerSuspend();

  function handleToggle() {
    toggleSuspend.mutate(
      { id: s.id, suspended: !s.suspended },
      {
        onSuccess: () => toast.success(s.suspended ? "Seller reinstated." : "Seller suspended."),
        onError: () => toast.error("Couldn't update seller."),
      },
    );
  }

  return (
    <article className={`rounded-2xl border p-3 ${s.suspended ? "border-destructive/30 bg-destructive/5" : "border-border/40 bg-surface"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{s.name}</p>
            <VerificationBadge seller={s} className="h-3.5 w-3.5 shrink-0" />
            {s.suspended && (
              <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                Suspended
              </span>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {s.category} · {s.location ?? "No location set"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{getSellerTrustLabel(s)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="flex items-center gap-0.5 text-xs font-semibold">
            <Star className="h-3 w-3 fill-gold text-gold" /> {s.rating}
          </span>
          <span className="text-[11px] text-muted-foreground">{s.deals} deals</span>
        </div>
      </div>

      {(s.disputeCount ?? 0) > 0 && (
        <p className="mt-2 text-xs text-destructive">
          {s.disputeCount} unresolved dispute{s.disputeCount === 1 ? "" : "s"}
        </p>
      )}

      <button
        type="button"
        disabled={toggleSuspend.isPending}
        onClick={handleToggle}
        className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 ${
          s.suspended ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
        }`}
      >
        {toggleSuspend.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : s.suspended ? (
          <UserCheck className="h-3.5 w-3.5" />
        ) : (
          <UserX className="h-3.5 w-3.5" />
        )}
        {s.suspended ? "Reinstate" : "Suspend"}
      </button>
    </article>
  );
}
