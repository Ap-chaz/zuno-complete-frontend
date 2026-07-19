import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, LogOut, UserX, UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { adminLogout } from "@/lib/admin-auth";
import { useBuyers, useToggleBuyerSuspend } from "@/hooks/queries/useBuyers";
import { formatCurrency } from "@/services/transactions.service";
import type { BuyerSummary } from "@/types/models";

export const Route = createFileRoute("/admin/buyers")({
  head: () => ({ meta: [{ title: "Buyer Accounts — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminBuyers />
    </AdminGate>
  ),
});

// NOTE: this directory is derived from transaction history (see
// buyers.service.ts) since there's no real multi-user table yet. Suspension
// state is in-memory only and resets on reload until a real backend exists.
function AdminBuyers() {
  const { data: buyers, isLoading } = useBuyers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!buyers) return [];
    const q = query.trim().toLowerCase();
    if (!q) return buyers;
    return buyers.filter((b) => b.name.toLowerCase().includes(q));
  }, [buyers, query]);

  return (
    <PhoneFrame>
      <TopBar
        title="Buyer Accounts"
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
            placeholder="Search buyer name…"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} buyer${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="space-y-2">
          {filtered.map((b) => (
            <BuyerRow key={b.name} buyer={b} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No buyers match this search.</p>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function BuyerRow({ buyer: b }: { buyer: BuyerSummary }) {
  const toggleSuspend = useToggleBuyerSuspend();

  function handleToggle() {
    toggleSuspend.mutate(
      { name: b.name, suspended: !b.suspended },
      {
        onSuccess: () => toast.success(b.suspended ? "Buyer reinstated." : "Buyer suspended."),
        onError: () => toast.error("Couldn't update this buyer."),
      },
    );
  }

  return (
    <article className={`rounded-2xl border p-3 ${b.suspended ? "border-destructive/30 bg-destructive/5" : "border-border/40 bg-surface"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{b.name}</p>
            {b.suspended && (
              <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                Suspended
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {b.transactionCount} transaction{b.transactionCount === 1 ? "" : "s"} · Last active {b.lastTransactionDate}
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold">{formatCurrency(b.totalSpent)}</span>
      </div>

      {b.disputeCount > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" /> {b.disputeCount} disputed transaction{b.disputeCount === 1 ? "" : "s"}
        </p>
      )}

      <button
        type="button"
        disabled={toggleSuspend.isPending}
        onClick={handleToggle}
        className={`mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 ${
          b.suspended ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"
        }`}
      >
        {toggleSuspend.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : b.suspended ? (
          <UserCheck className="h-3.5 w-3.5" />
        ) : (
          <UserX className="h-3.5 w-3.5" />
        )}
        {b.suspended ? "Reinstate" : "Suspend"}
      </button>
    </article>
  );
}
