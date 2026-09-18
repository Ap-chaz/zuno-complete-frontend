import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Shield, Copy, Check } from "lucide-react";
import { VerificationBadge } from "@/components/zuno/VerificationBadge";
import { useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { ErrorState, CardSkeleton } from "@/components/common/StateViews";
import { useTransaction } from "@/hooks/queries/useTransactions";
import { useSeller } from "@/hooks/queries/useSellers";
import { formatCurrency, statusColorClass } from "@/services/transactions.service";
import zunoLogo from "@/assets/zuno-logo-new.png";

export const Route = createFileRoute("/app/transaction/$id")({
  head: ({ params }) => ({ meta: [{ title: `Receipt ${params.id} — ZUNO` }] }),
  component: TxDetail,
});

function TxDetail() {
  const { id } = Route.useParams();
  const { data: tx, isLoading, isError, refetch } = useTransaction(id);
  const { data: seller } = useSeller(tx?.sellerId);
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!tx) return;
    try {
      await navigator.clipboard.writeText(tx.id);
      setCopied(true);
      toast.success("Transaction ID copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — select and copy manually.");
    }
  };

  const handleDownloadReceipt = () => {
    if (!tx) return;
    const escrowFee = Math.round(tx.amount * 0.015);
    const w = window.open("", "_blank", "width=440,height=760");
    if (!w) {
      toast.error("Please allow pop-ups to download the receipt.");
      return;
    }
    w.document.write(`
      <html>
        <head>
          <title>Receipt #${tx.id}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
          <style>
            :root {
              --gold-1: oklch(0.82 0.16 78);
              --gold-2: oklch(0.7 0.18 60);
              --gold-text: oklch(0.55 0.16 68);
              --ink: #141a29;
              --muted: #6b7280;
            }
            * { box-sizing: border-box; }
            body {
              font-family: "Plus Jakarta Sans", -apple-system, "Segoe UI", sans-serif;
              margin: 0;
              color: var(--ink);
              background: #f4f5f7;
            }
            .sheet { max-width: 480px; margin: 0 auto; background: #fff; }
            .banner {
              padding: 28px 32px 22px;
              background: linear-gradient(135deg, var(--gold-1), var(--gold-2));
              color: #241a08;
            }
            .banner img { height: 30px; display: block; margin-bottom: 14px; }
            .banner .title { font-size: 17px; font-weight: 800; margin: 0; }
            .banner .sub { margin: 2px 0 0; font-size: 12px; opacity: 0.85; }
            .body { padding: 28px 32px 32px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 9px 0; font-size: 13px; border-bottom: 1px solid #eef0f3; }
            td:last-child { text-align: right; font-weight: 600; }
            .total td { border-top: 2px solid var(--ink); border-bottom: none; font-size: 15px; padding-top: 14px; font-weight: 800; }
            .badge {
              margin-top: 22px; display: flex; align-items: center; gap: 8px;
              background: color-mix(in oklch, var(--gold-2) 12%, white);
              border: 1px solid color-mix(in oklch, var(--gold-2) 30%, white);
              color: var(--gold-text);
              border-radius: 12px; padding: 10px 12px; font-size: 12px; font-weight: 600;
            }
            .note { margin-top: 16px; font-size: 11px; color: #9ca3af; line-height: 1.6; }
            .footer { margin-top: 28px; padding-top: 16px; border-top: 1px dashed #e5e7eb; font-size: 10px; color: #b3b8c2; text-align: center; }
            @media print {
              body { background: #fff; }
              .sheet { max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="banner">
              <img src="${zunoLogo}" alt="ZUNO" />
              <p class="title">Payment Receipt</p>
              <p class="sub">#${tx.id} · ${tx.date} · ${tx.status}</p>
            </div>
            <div class="body">
              <table>
                <tr><td>Item</td><td>${tx.item}</td></tr>
                <tr><td>Category</td><td>${tx.category}</td></tr>
                <tr><td>Seller</td><td>${tx.seller}</td></tr>
                <tr><td>Payment method</td><td>M-PESA</td></tr>
                <tr><td>Escrow fee</td><td>${formatCurrency(escrowFee)}</td></tr>
                <tr class="total"><td>Total paid</td><td>${formatCurrency(tx.amount)}</td></tr>
              </table>
              <div class="badge">🛡️ Protected by ZUNO SafePay</div>
              <p class="note">This is a receipt of payment into ZUNO escrow, not proof of delivery. Funds are released to the seller only after delivery is confirmed.</p>
              <p class="footer">ZUNO Pay · zuno.co.ke</p>
            </div>
          </div>
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Receipt" back="/app/transactions" />
        <div className="space-y-4 px-5 pt-4">
          <CardSkeleton className="h-40" />
          <CardSkeleton className="h-32" />
          <CardSkeleton className="h-20" />
        </div>
      </div>
    );
  }

  if (isError || !tx) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Receipt" back="/app/transactions" />
        <div className="px-5 pt-6">
          <ErrorState title="Transaction not found" description="This receipt may have moved or doesn't exist." onRetry={() => refetch()} />
          <Link to="/app/transactions" className="mt-4 block text-center text-sm font-medium text-gold">
            Back to Activity
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Receipt" back="/app/transactions" />

      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-3xl border border-border/40 bg-gradient-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">TOTAL PAID</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColorClass(tx.status)}`}>{tx.status}</span>
          </div>
          <p className="mt-3 text-4xl font-bold">{formatCurrency(tx.amount)}</p>
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-3 py-2">
            <Shield className="h-4 w-4 text-accent" />
            <p className="text-xs font-medium text-accent">Protected by ZUNO SafePay</p>
          </div>
        </div>

        <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">PAYMENT INFORMATION</p>
        <dl className="mt-2 space-y-3 rounded-2xl border border-border/40 bg-surface p-4 text-sm">
          <Row label="Transaction ID" value={`#${tx.id}`} mono>
            <button onClick={handleCopyId} aria-label="Copy transaction ID" className="text-muted-foreground transition-colors hover:text-gold">
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </Row>
          <Row label="Date" value={tx.date} />
          <Row label="Method" value="M-PESA · +254 714 637 437" />
          <Row label="Escrow fee" value={formatCurrency(Math.round(tx.amount * 0.015))} />
          <Row label="Category" value={tx.category} />
        </dl>

        <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">SELLER</p>
        <Link
          to="/app/seller/$id"
          params={{ id: tx.sellerId }}
          className="mt-2 flex items-center gap-3 rounded-2xl border border-border/40 bg-surface p-4 transition-colors hover:border-gold/30"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-violet font-bold">{seller?.initials ?? tx.seller.slice(0, 2).toUpperCase()}</div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold">{tx.seller}</p>
              {seller && <VerificationBadge seller={seller} />}
            </div>
            <p className="text-xs text-muted-foreground">{seller ? `Trusted seller · ${seller.rating} ★` : "View seller profile"}</p>
          </div>
        </Link>

        <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">ITEM</p>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border/40 bg-surface p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-xl">📱</span>
          <div className="flex-1">
            <p className="font-semibold">{tx.item}</p>
            <p className="text-xs text-muted-foreground">{tx.category}</p>
          </div>
        </div>

        {(tx.status === "Pending" || tx.status === "Funded" || tx.status === "Protected") && (
          <Link
            to="/app/tracking/$id"
            params={{ id: tx.id }}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            Track this order
          </Link>
        )}

        <button
          onClick={handleDownloadReceipt}
          className="my-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95"
        >
          <Download className="h-4 w-4" /> Download receipt (PDF)
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono, children }: { label: string; value: string; mono?: boolean; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={`text-right font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
        {children}
      </dd>
    </div>
  );
}
