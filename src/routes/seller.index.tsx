import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, TrendingUp, Package, Wallet, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/zuno/Logo";
import { currency } from "@/lib/zuno-data";

export const Route = createFileRoute("/seller/")({
  head: () => ({ meta: [{ title: "Seller Dashboard — ZUNO" }] }),
  component: SellerHome,
});

function SellerHome() {
  return (
    <div className="flex-1 overflow-y-auto pb-6">
      <header className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">SELLER</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/seller/notifications" className="relative grid h-10 w-10 place-items-center rounded-xl bg-surface">
            <Bell className="h-5 w-5 text-gold" />
          </Link>
          <Link to="/seller/account" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-sm font-bold text-gold-foreground">
            Z
          </Link>
        </div>
      </header>

      <div className="mx-5 mt-5 overflow-hidden rounded-3xl border border-border/40 bg-gradient-card p-6 shadow-card">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TOTAL EARNINGS · JUNE</p>
        <p className="mt-2 text-4xl font-bold">{currency(1284500)}</p>
        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-success">
          <ArrowUpRight className="h-3.5 w-3.5" /> +18.4% vs last month
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/40 pt-4">
          <div>
            <p className="text-[10px] tracking-wider text-muted-foreground">PENDING PAYOUT</p>
            <p className="mt-0.5 text-base font-bold text-gold">{currency(286400)}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-wider text-muted-foreground">IN ESCROW</p>
            <p className="mt-0.5 text-base font-bold">{currency(420800)}</p>
          </div>
        </div>

        <button
          onClick={() => toast.info("Payouts to M-PESA are coming soon — your balance stays safely on ZUNO until then.")}
          className="mt-4 flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95"
        >
          Withdraw to M-PESA
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-5">
        <Stat icon={TrendingUp} label="Today's sales" value={currency(48200)} delta="+12%" up />
        <Stat icon={Package} label="Active orders" value="14" delta="3 new" up />
        <Stat icon={Wallet} label="Completed" value="328" delta="this month" />
        <Stat icon={Star} label="Avg. rating" value="4.9" delta="612 reviews" />
      </div>

      <section className="mt-7 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Sales overview</h2>
          <span className="text-xs text-muted-foreground">Last 7 days</span>
        </div>
        <div className="mt-3 rounded-3xl border border-border/40 bg-surface p-5">
          <div className="flex h-32 items-end gap-2">
            {[40, 65, 30, 80, 55, 92, 70].map((h, i) => (
              <div key={i} className="flex-1">
                <div className="rounded-t-lg bg-gradient-gold" style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[10px] text-muted-foreground">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Recent activity</h2>
          <Link to="/seller/transactions" className="flex items-center gap-1 text-xs font-medium text-gold">See all <ArrowUpRight className="h-3 w-3" /></Link>
        </div>
        <ul className="mt-3 space-y-2">
          {[
            { item: "iPhone 17 Pro Max", buyer: "Alvan M.", amount: 191311, status: "Funded", up: true },
            { item: "MacBook Air M4", buyer: "Brenda K.", amount: 145000, status: "Released", up: true },
            { item: "Refund issued", buyer: "James O.", amount: -42000, status: "Refunded", up: false },
          ].map((r, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border/40 bg-surface p-3.5">
              <span className={`grid h-10 w-10 place-items-center rounded-2xl ${r.up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                {r.up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.item}</p>
                <p className="truncate text-xs text-muted-foreground">{r.buyer}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${r.up ? "" : "text-destructive"}`}>{r.up ? "+" : ""}{currency(Math.abs(r.amount))}</p>
                <p className="text-[10px] text-muted-foreground">{r.status}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}

function Stat({ icon: Icon, label, value, delta, up }: { icon: typeof TrendingUp; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold/15 text-gold"><Icon className="h-4 w-4" /></span>
        <span className={`text-[10px] font-semibold ${up ? "text-success" : "text-muted-foreground"}`}>{delta}</span>
      </div>
      <p className="mt-3 text-lg font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
