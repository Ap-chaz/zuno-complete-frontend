import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Download, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { currency } from "@/lib/zuno-data";
import { exportToCsv } from "@/lib/csv-export";

export const Route = createFileRoute("/seller/transactions")({
  head: () => ({ meta: [{ title: "Payouts — ZUNO Seller" }] }),
  component: Payouts,
});

const rows = [
  { kind: "in", label: "Sale · iPhone 17", date: "05/06/2026", amount: 191311, status: "Funded" },
  { kind: "in", label: "Sale · MacBook Air", date: "04/06/2026", amount: 145000, status: "Released" },
  { kind: "out", label: "Withdraw to M-PESA", date: "03/06/2026", amount: 320000, status: "Sent" },
  { kind: "in", label: "Sale · Sony WH-1000XM6", date: "03/06/2026", amount: 42500, status: "Released" },
  { kind: "out", label: "Refund · Galaxy S25", date: "28/05/2026", amount: 124000, status: "Refunded" },
  { kind: "in", label: "Sale · Apple Watch Ultra", date: "25/05/2026", amount: 98500, status: "Released" },
];

function Payouts() {
  const handleExport = () => {
    try {
      exportToCsv(
        `zuno-payouts-${new Date().toISOString().slice(0, 10)}.csv`,
        rows,
        [
          { header: "Description", accessor: (r) => r.label },
          { header: "Date", accessor: (r) => r.date },
          { header: "Type", accessor: (r) => (r.kind === "in" ? "Income" : "Outgoing") },
          { header: "Amount (KES)", accessor: (r) => r.amount },
          { header: "Status", accessor: (r) => r.status },
        ],
      );
      toast.success("CSV downloaded.");
    } catch {
      toast.error("Couldn't generate the CSV. Please try again.");
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Revenue & Payouts" />
      <div className="px-5 pt-4 pb-8">
        <div className="grid grid-cols-3 gap-3">
          <Tile label="Earned" value={currency(1284500)} className="col-span-3 bg-gradient-card border-gold/30" big />
          <Tile label="Payouts" value={currency(960000)} />
          <Tile label="Pending" value={currency(286400)} accent />
          <Tile label="Refunds" value={currency(38000)} />
        </div>

        <button
          onClick={handleExport}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>

        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">HISTORY</p>
        <ul className="mt-3 divide-y divide-border/40 overflow-hidden rounded-2xl border border-border/40 bg-surface">
          {rows.map((r, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5">
              <span className={`grid h-10 w-10 place-items-center rounded-2xl ${r.kind === "in" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                {r.kind === "in" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{r.label}</p>
                <p className="truncate text-xs text-muted-foreground">{r.date} · {r.status}</p>
              </div>
              <p className={`text-sm font-bold ${r.kind === "in" ? "text-success" : "text-destructive"}`}>
                {r.kind === "in" ? "+" : "−"}{currency(r.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Tile({ label, value, className = "", big, accent }: { label: string; value: string; className?: string; big?: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border/40 bg-surface p-4 ${className}`}>
      <p className="text-[10px] tracking-wider text-muted-foreground">{label.toUpperCase()}</p>
      <p className={`mt-1 font-bold ${big ? "text-3xl" : "text-base"} ${accent ? "text-gold" : ""}`}>{value}</p>
    </div>
  );
}
