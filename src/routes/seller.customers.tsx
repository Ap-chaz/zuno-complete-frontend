import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, BadgeCheck, Users } from "lucide-react";
import { TopBar } from "@/components/zuno/TopBar";
import { EmptyState } from "@/components/common/StateViews";
import { currency } from "@/lib/zuno-data";

export const Route = createFileRoute("/seller/customers")({
  head: () => ({ meta: [{ title: "Customers — ZUNO Seller" }] }),
  component: Customers,
});

const customers = [
  { name: "Alvan Mwangi", initials: "AM", orders: 5, spent: 540000, trust: 920, rating: 5, verified: true },
  { name: "Brenda Kerubo", initials: "BK", orders: 3, spent: 318000, trust: 880, rating: 5, verified: true },
  { name: "James Otieno", initials: "JO", orders: 8, spent: 1240000, trust: 960, rating: 4.9, verified: true },
  { name: "Mary Wanjiru", initials: "MW", orders: 2, spent: 87000, trust: 720, rating: 4.8, verified: true },
  { name: "Peter Kim", initials: "PK", orders: 1, spent: 98500, trust: 640, rating: 5, verified: false },
];

function Customers() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => customers.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

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
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try a different name." />
        ) : (
          <ul className="space-y-2">
            {filtered.map((c) => (
          <li key={c.name} className="rounded-3xl border border-border/40 bg-surface p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-violet font-bold">{c.initials}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate font-semibold">{c.name}</p>
                  {c.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-gold" />}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span><span className="font-semibold text-foreground">{c.orders}</span> orders</span>
                  <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-gold text-gold" /> {c.rating}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold">{currency(c.spent)}</p>
                <p className="text-[10px] text-muted-foreground">Trust {c.trust}</p>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-gold" style={{ width: `${(c.trust / 1000) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
