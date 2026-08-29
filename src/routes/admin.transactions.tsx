import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Flag,
  LogOut,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { adminLogout } from "@/lib/admin-auth";
import { useTransactions, useUpdateTransactionStatus, useToggleTransactionFlag } from "@/hooks/queries/useTransactions";
import { formatCurrency, statusColorClass } from "@/services/transactions.service";
import type { Transaction, TxStatus } from "@/types/models";

const ALL_STATUSES: TxStatus[] = ["Pending", "Funded", "Protected", "Completed", "Refunded", "Disputed"];

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({ meta: [{ title: "Transaction Monitoring — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminTransactions />
    </AdminGate>
  ),
});

function AdminTransactions() {
  const { data: transactions, isLoading } = useTransactions();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TxStatus>("All");
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = transactions ?? [];
    if (statusFilter !== "All") result = result.filter((t) => t.status === statusFilter);
    if (flaggedOnly) result = result.filter((t) => t.flaggedForReview);
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.item.toLowerCase().includes(q) ||
          t.seller.toLowerCase().includes(q) ||
          (t.buyerName ?? "").toLowerCase().includes(q),
      );
    }
    return result;
  }, [transactions, statusFilter, flaggedOnly, query]);

  function exportCsv() {
    if (!filtered.length) {
      toast.error("Nothing to export for the current filters.");
      return;
    }
    const headers = ["ID", "Item", "Category", "Buyer", "Seller", "Amount (KES)", "Date", "Status", "Flagged"];
    const rows = filtered.map((t) => [
      t.id,
      t.item,
      t.category,
      t.buyerName ?? "",
      t.seller,
      String(t.amount),
      t.date,
      t.status,
      t.flaggedForReview ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zuno-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} transaction${filtered.length === 1 ? "" : "s"}.`);
  }

  return (
    <PhoneFrame>
      <TopBar
        title="Transaction Monitoring"
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
        <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-input px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, item, buyer, seller…"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {(["All", ...ALL_STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === s
                  ? "border-gold bg-gold text-gold-foreground"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFlaggedOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              flaggedOnly
                ? "border-destructive bg-destructive/15 text-destructive"
                : "border-border bg-surface text-muted-foreground"
            }`}
          >
            <Flag className="h-3.5 w-3.5" /> Flagged only
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-gold/40 hover:text-gold"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`}
        </p>

        <div className="mt-2 space-y-3">
          {filtered.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <div className="rounded-2xl border border-border/40 bg-surface p-6 text-center">
              <p className="text-sm text-muted-foreground">No transactions match these filters.</p>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}

function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  const [expanded, setExpanded] = useState(false);
  const [nextStatus, setNextStatus] = useState<TxStatus>(t.status);
  const updateStatus = useUpdateTransactionStatus();
  const toggleFlag = useToggleTransactionFlag();

  function handleStatusOverride() {
    if (nextStatus === t.status) {
      toast.error("Pick a different status to apply an override.");
      return;
    }
    updateStatus.mutate(
      { id: t.id, status: nextStatus },
      { onSuccess: () => toast.success(`Status changed to "${nextStatus}".`) },
    );
  }

  function handleToggleFlag() {
    toggleFlag.mutate(
      { id: t.id, flagged: !t.flaggedForReview },
      {
        onSuccess: () =>
          toast.success(t.flaggedForReview ? "Unflagged." : "Flagged for fraud review."),
      },
    );
  }

  const busy = updateStatus.isPending || toggleFlag.isPending;

  return (
    <article className="rounded-2xl border border-border/40 bg-surface p-4">
      <button type="button" onClick={() => setExpanded((v) => !v)} className="flex w-full items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{t.item}</p>
            {t.flaggedForReview && <Flag className="h-3.5 w-3.5 shrink-0 text-destructive" />}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground">{t.id}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.buyerName ?? "Unknown buyer"} → {t.seller}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColorClass(t.status)}`}>
            {t.status}
          </span>
          <span className="text-xs font-semibold">{formatCurrency(t.amount)}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
          <p className="text-xs text-muted-foreground">
            {t.category} · {t.date}
          </p>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-muted-foreground">Override status</span>
            <div className="flex gap-2">
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as TxStatus)}
                className="h-9 flex-1 rounded-xl border border-border/60 bg-input px-2 text-xs outline-none focus:border-gold/50"
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy}
                onClick={handleStatusOverride}
                className="flex h-9 items-center justify-center gap-1 rounded-xl bg-gradient-gold px-3 text-xs font-semibold text-gold-foreground disabled:opacity-50"
              >
                {updateStatus.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Apply
              </button>
            </div>
          </label>

          <button
            type="button"
            disabled={busy}
            onClick={handleToggleFlag}
            className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold disabled:opacity-50 ${
              t.flaggedForReview ? "bg-surface-2 text-muted-foreground" : "bg-destructive/15 text-destructive"
            }`}
          >
            <Flag className="h-3.5 w-3.5" />
            {t.flaggedForReview ? "Remove fraud flag" : "Flag for fraud review"}
          </button>
        </div>
      )}
    </article>
  );
}
