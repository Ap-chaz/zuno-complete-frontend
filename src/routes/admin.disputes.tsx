import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  ShieldCheck,
  Ban,
  LogOut,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { AdminGate } from "@/components/zuno/AdminGate";
import { adminLogout } from "@/lib/admin-auth";
import { useDisputes, useResolveDispute } from "@/hooks/queries/useDisputes";
import { useTransaction, useUpdateTransactionStatus } from "@/hooks/queries/useTransactions";
import type { Dispute, DisputeStatus } from "@/types/models";

export const Route = createFileRoute("/admin/disputes")({
  head: () => ({ meta: [{ title: "Dispute Resolution Center — ZUNO Admin" }] }),
  component: () => (
    <AdminGate>
      <AdminDisputes />
    </AdminGate>
  ),
});

// NOTE: resolving a dispute here updates the dispute record AND the linked
// transaction's status in the mock data, so the two stay consistent in the
// demo. It does not move any real money — an actual refund/release requires
// a backend payment integration. This UI is the workflow, not the payment rail.
function AdminDisputes() {
  const { data: disputes, isLoading } = useDisputes();

  const open = disputes?.filter((d) => d.status === "open" || d.status === "under_review") ?? [];
  const closed = disputes?.filter((d) => d.status === "resolved" || d.status === "rejected") ?? [];

  return (
    <PhoneFrame>
      <TopBar
        title="Dispute Resolution Center"
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
          Review evidence for each dispute, then decide whether funds go back to the buyer or
          release to the seller.
        </p>

        {isLoading && <p className="text-sm text-muted-foreground">Loading disputes…</p>}

        {!isLoading && open.length === 0 && (
          <div className="rounded-2xl border border-border/40 bg-surface p-4 text-center">
            <CheckCircle2 className="mx-auto h-6 w-6 text-success" />
            <p className="mt-2 text-sm font-semibold">No open disputes</p>
            <p className="text-xs text-muted-foreground">You're all caught up.</p>
          </div>
        )}

        <div className="space-y-3">
          {open.map((d) => (
            <DisputeCard key={d.id} dispute={d} />
          ))}
        </div>

        {closed.length > 0 && (
          <>
            <p className="mb-3 mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">
              RESOLVED
            </p>
            <div className="space-y-3">
              {closed.map((d) => (
                <DisputeCard key={d.id} dispute={d} />
              ))}
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const { data: transaction } = useTransaction(dispute.transactionId);
  const resolveDispute = useResolveDispute();
  const updateTxStatus = useUpdateTransactionStatus();
  const [note, setNote] = useState("");
  const [expanded, setExpanded] = useState(false);

  const isOpen = dispute.status === "open" || dispute.status === "under_review";
  const busy = resolveDispute.isPending || updateTxStatus.isPending;

  function handleResolve(outcome: "buyer" | "seller") {
    if (!note.trim()) {
      toast.error("Add a short resolution note before deciding.");
      return;
    }
    resolveDispute.mutate(
      { id: dispute.id, resolvedInFavorOf: outcome, resolutionNote: note.trim() },
      {
        onSuccess: () => {
          updateTxStatus.mutate({
            id: dispute.transactionId,
            status: outcome === "buyer" ? "Refunded" : "Completed",
          });
          toast.success(outcome === "buyer" ? "Refunded to buyer." : "Released to seller.");
          setExpanded(false);
        },
        onError: () => toast.error("Couldn't save the resolution. Try again."),
      },
    );
  }

  function handleDismiss() {
    if (!note.trim()) {
      toast.error("Add a short note explaining why this dispute is being dismissed.");
      return;
    }
    resolveDispute.mutate(
      { id: dispute.id, resolvedInFavorOf: "seller", resolutionNote: note.trim() },
      {
        onSuccess: () => {
          toast.success("Dispute dismissed.");
          setExpanded(false);
        },
      },
    );
  }

  return (
    <article className="rounded-2xl border border-border/40 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{dispute.reason}</p>
          <p className="font-mono text-xs text-muted-foreground">#{dispute.transactionId}</p>
        </div>
        <StatusPill status={dispute.status} />
      </div>

      {transaction && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{transaction.item} · {transaction.seller}</span>
          <span className="shrink-0 font-semibold text-foreground">
            KES {transaction.amount.toLocaleString()}
          </span>
        </div>
      )}

      <p className="mt-2 text-xs text-muted-foreground">{dispute.description}</p>

      {!isOpen && dispute.resolutionNote && (
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <p className="text-xs font-semibold">
            {dispute.status === "rejected"
              ? "Dismissed"
              : dispute.resolvedInFavorOf === "buyer"
                ? "Refunded to buyer"
                : "Released to seller"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{dispute.resolutionNote}</p>
        </div>
      )}

      {isOpen && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold text-xs font-semibold text-gold-foreground"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" /> Resolve dispute
        </button>
      )}

      {isOpen && expanded && (
        <div className="mt-3 space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Resolution note (shown to both parties)…"
            rows={3}
            className="w-full rounded-xl border border-border/60 bg-input p-3 text-xs outline-none placeholder:text-muted-foreground focus:border-gold/50"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleResolve("buyer")}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-success/15 text-xs font-semibold text-success disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Refund buyer
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => handleResolve("seller")}
              className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gold/15 text-xs font-semibold text-gold disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowLeftRight className="h-3.5 w-3.5" />}
              Release to seller
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={handleDismiss}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-muted-foreground disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" /> Dismiss (no fund action)
          </button>
        </div>
      )}
    </article>
  );
}

function StatusPill({ status }: { status: DisputeStatus }) {
  const config: Record<DisputeStatus, { icon: typeof Clock; label: string; className: string }> = {
    open: { icon: AlertTriangle, label: "Open", className: "bg-destructive/15 text-destructive" },
    under_review: { icon: Clock, label: "In review", className: "bg-gold/10 text-gold" },
    resolved: { icon: CheckCircle2, label: "Resolved", className: "bg-success/15 text-success" },
    rejected: { icon: XCircle, label: "Dismissed", className: "bg-surface-2 text-muted-foreground" },
  };
  const { icon: Icon, label, className } = config[status];
  return (
    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${className}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}
