import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Shield, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { CardSkeleton, ErrorState } from "@/components/common/StateViews";
import { useTransaction, useUpdateTransactionStatus } from "@/hooks/queries/useTransactions";
import { formatCurrency } from "@/services/transactions.service";
import type { TxStatus } from "@/types/models";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/app/tracking/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — ZUNO` }] }),
  component: Tracking,
});

function stepsForStatus(status: TxStatus) {
  const base = [
    { title: "Payment secured by ZUNO", done: true },
    { title: "Seller preparing order", done: status !== "Pending" },
    { title: "Delivery in progress", done: status === "Completed", active: status === "Protected" || status === "Funded" },
    { title: "Order completed", done: status === "Completed" },
  ];
  return base;
}

function Tracking() {
  const { id } = Route.useParams();
  const { data: tx, isLoading, isError, refetch } = useTransaction(id);
  const updateStatus = useUpdateTransactionStatus();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Order Tracking" back="/app" />
        <div className="space-y-4 px-5 pt-4">
          <CardSkeleton className="h-36" />
          <CardSkeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (isError || !tx) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Order Tracking" back="/app" />
        <div className="px-5 pt-6">
          <ErrorState title="Order not found" description="We couldn't find this order." onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  const steps = stepsForStatus(tx.status);
  const canConfirmDelivery = tx.status === "Funded" || tx.status === "Protected";

  const handleConfirmDelivery = () => {
    updateStatus.mutate(
      { id: tx.id, status: "Completed" },
      {
        onSuccess: () => toast.success("Delivery confirmed — funds released to the seller."),
        onError: () => toast.error("Couldn't confirm delivery. Please try again."),
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Order Tracking" back="/app" />

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-base font-bold tracking-tight">#{tx.id}</p>
          <span className="rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-[10px] font-semibold text-accent">{tx.status}</span>
        </div>

        <div className="mt-4 overflow-hidden rounded-3xl border border-accent/30 bg-gradient-violet/40 p-5 shadow-card">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TOTAL PAID</p>
          <p className="mt-2 text-4xl font-bold">{formatCurrency(tx.amount)}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/40 pt-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Item</p>
              <p className="mt-0.5 font-semibold">{tx.item}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Seller</p>
              <p className="mt-0.5 font-semibold">{tx.seller}</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">PROGRESS</p>

        <ol className="mt-3 space-y-0">
          {steps.map((s, i) => (
            <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full text-xs font-bold ${
                    s.done ? "bg-accent text-accent-foreground" : s.active ? "border-2 border-gold bg-gold/15 text-gold" : "border-2 border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {s.done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-12 w-0.5 ${s.done ? "bg-accent" : "bg-border"}`} />}
              </div>
              <div className="pb-6 pt-1.5">
                <p className={`text-sm font-semibold ${s.done || s.active ? "text-foreground" : "text-muted-foreground"}`}>{s.title}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/5 p-3">
          <Shield className="h-4 w-4 shrink-0 text-gold" />
          <p className="text-xs text-muted-foreground">Payment will be released once you confirm delivery.</p>
        </div>

        {canConfirmDelivery && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={updateStatus.isPending}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-60"
              >
                {updateStatus.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Delivery & Release Funds
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm delivery?</AlertDialogTitle>
                <AlertDialogDescription>
                  This releases {formatCurrency(tx.amount)} to {tx.seller}. Only confirm once you've received "{tx.item}" and it matches
                  what you ordered — this can't be undone from here.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Not yet</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelivery}>Yes, release funds</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={() => toast.info("In-app messaging is coming soon.")}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            <MessageCircle className="h-4 w-4" /> Message seller
          </button>
          <Link
            to="/app/disputes"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/15"
          >
            <AlertCircle className="h-4 w-4" /> Report issue
          </Link>
        </div>
      </div>
    </div>
  );
}
