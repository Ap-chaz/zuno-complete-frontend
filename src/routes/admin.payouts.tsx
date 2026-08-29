import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, LogOut, Loader2, Check, Landmark, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { adminLogout } from "@/lib/admin-auth";
import { useTransactions, useMarkPayoutPaid } from "@/hooks/queries/useTransactions";
import { useSellers } from "@/hooks/queries/useSellers";
import { formatCurrency } from "@/services/transactions.service";
import type { Transaction, Seller } from "@/types/models";

export const Route = createFileRoute("/admin/payouts")({
  head: () => ({ meta: [{ title: "Payout & Refund Queue — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminPayouts />
    </AdminGate>
  ),
});

// NOTE: "Mark as paid" only updates the record in mock data — it does not
// actually send an M-Pesa/bank transfer. Until a real payment integration
// exists, sending the money is a manual step someone does outside this
// screen; this just tracks whether that manual step has happened.
function AdminPayouts() {
  const { data: transactions, isLoading: loadingTx } = useTransactions();
  const { data: sellers, isLoading: loadingSellers } = useSellers();
  const [tab, setTab] = useState<"owed" | "paid">("owed");

  const sellerById = useMemo(() => {
    const map = new Map<string, Seller>();
    sellers?.forEach((s) => map.set(s.id, s));
    return map;
  }, [sellers]);

  const payouts = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => t.status === "Completed");
  }, [transactions]);

  const refunds = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => t.status === "Refunded");
  }, [transactions]);

  const owedPayouts = payouts.filter((t) => t.payoutStatus !== "paid");
  const owedRefunds = refunds.filter((t) => t.payoutStatus !== "paid");
  const paidPayouts = payouts.filter((t) => t.payoutStatus === "paid");
  const paidRefunds = refunds.filter((t) => t.payoutStatus === "paid");

  const totalOwedToSellers = owedPayouts.reduce((sum, t) => sum + t.amount, 0);
  const totalOwedToBuyers = owedRefunds.reduce((sum, t) => sum + t.amount, 0);

  const isLoading = loadingTx || loadingSellers;

  return (
    <PhoneFrame>
      <TopBar
        title="Payout & Refund Queue"
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
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-border/40 bg-surface p-3">
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ArrowUpFromLine className="h-3 w-3" /> Owed to sellers
            </p>
            <p className="mt-1 text-lg font-bold text-gold">{formatCurrency(totalOwedToSellers)}</p>
            <p className="text-[11px] text-muted-foreground">{owedPayouts.length} pending</p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-surface p-3">
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ArrowDownToLine className="h-3 w-3" /> Owed to buyers
            </p>
            <p className="mt-1 text-lg font-bold text-destructive">{formatCurrency(totalOwedToBuyers)}</p>
            <p className="text-[11px] text-muted-foreground">{owedRefunds.length} pending</p>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <TabButton active={tab === "owed"} onClick={() => setTab("owed")} label="Pending" />
          <TabButton active={tab === "paid"} onClick={() => setTab("paid")} label="Paid" />
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {tab === "owed" && !isLoading && (
          <>
            <SectionLabel label="SELLER PAYOUTS" />
            <div className="space-y-2">
              {owedPayouts.map((t) => (
                <PayoutRow key={t.id} transaction={t} kind="payout" seller={sellerById.get(t.sellerId)} />
              ))}
              {owedPayouts.length === 0 && <EmptyNote text="No seller payouts pending." />}
            </div>

            <SectionLabel label="BUYER REFUNDS" className="mt-6" />
            <div className="space-y-2">
              {owedRefunds.map((t) => (
                <PayoutRow key={t.id} transaction={t} kind="refund" seller={sellerById.get(t.sellerId)} />
              ))}
              {owedRefunds.length === 0 && <EmptyNote text="No buyer refunds pending." />}
            </div>
          </>
        )}

        {tab === "paid" && !isLoading && (
          <>
            <SectionLabel label="SELLER PAYOUTS" />
            <div className="space-y-2">
              {paidPayouts.map((t) => (
                <PayoutRow key={t.id} transaction={t} kind="payout" seller={sellerById.get(t.sellerId)} readOnly />
              ))}
              {paidPayouts.length === 0 && <EmptyNote text="No completed seller payouts yet." />}
            </div>

            <SectionLabel label="BUYER REFUNDS" className="mt-6" />
            <div className="space-y-2">
              {paidRefunds.map((t) => (
                <PayoutRow key={t.id} transaction={t} kind="refund" seller={sellerById.get(t.sellerId)} readOnly />
              ))}
              {paidRefunds.length === 0 && <EmptyNote text="No completed buyer refunds yet." />}
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 flex-1 rounded-xl text-xs font-semibold transition-colors ${
        active ? "bg-gradient-gold text-gold-foreground" : "bg-surface text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ label, className = "" }: { label: string; className?: string }) {
  return <p className={`mb-2 text-xs font-bold tracking-[0.18em] text-muted-foreground ${className}`}>{label}</p>;
}

function EmptyNote({ text }: { text: string }) {
  return <p className="rounded-xl bg-surface p-3 text-center text-xs text-muted-foreground">{text}</p>;
}

function PayoutRow({
  transaction: t,
  kind,
  seller,
  readOnly = false,
}: {
  transaction: Transaction;
  kind: "payout" | "refund";
  seller?: Seller;
  readOnly?: boolean;
}) {
  const markPaid = useMarkPayoutPaid();

  function handleMarkPaid() {
    markPaid.mutate(t.id, {
      onSuccess: () => toast.success(kind === "payout" ? "Payout marked as sent." : "Refund marked as sent."),
      onError: () => toast.error("Couldn't update this record."),
    });
  }

  const recipient = kind === "payout" ? t.seller : t.buyerName ?? "Unknown buyer";

  return (
    <article className="rounded-2xl border border-border/40 bg-surface p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{recipient}</p>
          <p className="truncate text-xs text-muted-foreground">
            {t.item} · <span className="font-mono">{t.id}</span>
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold">{formatCurrency(t.amount)}</span>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {kind === "payout" && seller?.payoutMethod ? (
          <>
            {seller.payoutMethod === "mpesa" ? (
              <Smartphone className="h-3.5 w-3.5 text-gold" />
            ) : (
              <Landmark className="h-3.5 w-3.5 text-gold" />
            )}
            <span>
              {seller.payoutMethod === "bank" ? `${seller.payoutBankName} · ` : ""}
              {seller.payoutDetails}
            </span>
          </>
        ) : kind === "payout" ? (
          <span className="italic">No payout method on file — contact seller</span>
        ) : (
          <span className="italic">Refund via original payment method</span>
        )}
      </div>

      {!readOnly && (
        <button
          type="button"
          disabled={markPaid.isPending}
          onClick={handleMarkPaid}
          className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-gold text-xs font-semibold text-gold-foreground disabled:opacity-50"
        >
          {markPaid.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Wallet className="h-3.5 w-3.5" />
          )}
          Mark as {kind === "payout" ? "paid out" : "refunded"}
        </button>
      )}
      {readOnly && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-success">
          <Check className="h-3.5 w-3.5" /> {kind === "payout" ? "Paid out" : "Refunded"}
        </p>
      )}
    </article>
  );
}
