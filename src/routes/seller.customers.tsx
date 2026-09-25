import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BadgeCheck, Users, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/zuno/TopBar";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import { currency } from "@/lib/zuno-data";
import { useBuyers } from "@/hooks/queries/useBuyers";
import type { BuyerSummary } from "@/types/models";

export const Route = createFileRoute("/seller/customers")({
  head: () => ({ meta: [{ title: "Customers — ZUNO Seller" }] }),
  component: Customers,
});

// NOTE: same directory buyers.service.ts builds for admin.buyers.tsx —
// derived from transaction history, since there's no real multi-user table
// or per-seller customer list yet. See buyers.service.ts for details.
function Customers() {
  const { data: buyers, isLoading, isError, refetch } = useBuyers();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!buyers) return [];
    const q = query.trim().toLowerCase();
    if (!q) return buyers;
    return buyers.filter((c) => c.name.toLowerCase().includes(q));
  }, [buyers, query]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Customers" />

      <div className="px-5 pt-4">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-border/60 bg-input px-4 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <div className="mt-4 px-5 pb-8">
        {isError ? (
          <ErrorState description="Couldn't load your customers." onRetry={() => refetch()} />
        ) : isLoading ? (
          <ListSkeleton rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={query ? "No customers found" : "No customers yet"}
            description={query ? "Try a different name." : "Buyers who purchase from you will show up here."}
          />
        ) : (
          <ul className="space-y-2">
            {filtered.map((c) => (
              <CustomerRow key={c.name} customer={c} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function CustomerRow({ customer: c }: { customer: BuyerSummary }) {
  const initials = c.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

  return (
    <li className="rounded-3xl border border-border/40 bg-surface p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-violet font-bold">{initials}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-semibold">{c.name}</p>
            {c.kycStatus === "verified" && <BadgeCheck className="h-4 w-4 shrink-0 text-gold" aria-label="Verified buyer" />}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{c.transactionCount}</span> order{c.transactionCount === 1 ? "" : "s"} · Last {c.lastTransactionDate}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold">{currency(c.totalSpent)}</p>
        </div>
      </div>
      {c.disputeCount > 0 && (
        <p className="mt-2 flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" /> {c.disputeCount} disputed order{c.disputeCount === 1 ? "" : "s"}
        </p>
      )}
    </li>
  );
}
