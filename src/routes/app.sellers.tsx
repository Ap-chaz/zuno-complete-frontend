import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star, ChevronRight, Store } from "lucide-react";
import { TopBar } from "@/components/zuno/TopBar";
import { VerificationBadge } from "@/components/zuno/VerificationBadge";
import { EmptyState, ErrorState, ListSkeleton } from "@/components/common/StateViews";
import { useSellerSearch } from "@/hooks/queries/useSellers";
import { SELLER_CATEGORIES } from "@/services/sellers.service";
import { isEligibleForDisplay } from "@/lib/seller-eligibility";

export const Route = createFileRoute("/app/sellers")({
  head: () => ({ meta: [{ title: "Verified Sellers — ZUNO" }] }),
  component: Sellers,
});

function Sellers() {
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const { data: searchResults, isLoading, isError, refetch } = useSellerSearch(query, cat);
  const filtered = searchResults?.filter(isEligibleForDisplay);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Verified Sellers" back="/app" />

      <div className="px-5 pt-4">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-border/60 bg-input px-4 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sellers, products…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1 hide-scrollbar">
        {SELLER_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              cat === c ? "border-gold bg-gold text-gold-foreground" : "border-border bg-surface text-muted-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-5 pb-6">
        {isLoading && <ListSkeleton rows={3} />}
        {isError && <ErrorState description="Couldn't load sellers." onRetry={() => refetch()} />}
        {!isLoading && !isError && (filtered?.length ?? 0) === 0 && (
          <EmptyState icon={Store} title="No sellers found" description="Try a different search term or category." />
        )}
        {!isLoading &&
          !isError &&
          filtered?.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-3xl border border-border/40 bg-surface shadow-card">
              <div className={`h-20 bg-gradient-to-br ${s.color}`} />
              <div className="p-4 pt-0">
                <div className="-mt-8 grid h-16 w-16 place-items-center rounded-2xl border-4 border-surface bg-gradient-violet text-lg font-bold">
                  {s.initials}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-semibold">{s.name}</h3>
                      <VerificationBadge seller={s} />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{s.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {s.rating}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{s.reviews} reviews</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="flex gap-4 text-xs">
                    <span>
                      <span className="font-bold text-foreground">{s.deals.toLocaleString()}</span> <span className="text-muted-foreground">deals</span>
                    </span>
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">{s.category}</span>
                  </div>
                  <Link to="/app/seller/$id" params={{ id: s.id }} className="flex items-center gap-1 text-xs font-semibold text-gold">
                    View seller <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
      </div>
    </div>
  );
}
