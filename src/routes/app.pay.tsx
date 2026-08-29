import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, AlertTriangle, Lock, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { currency } from "@/lib/zuno-data";
import { KycGate } from "@/components/zuno/KycGate";
import { transactionsService } from "@/services/transactions.service";

export const Route = createFileRoute("/app/pay")({
  head: () => ({ meta: [{ title: "Secure Payment — ZUNO" }] }),
  component: () => (
    <KycGate fallback="/app">
      <Pay />
    </KycGate>
  ),
});

function Pay() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"M-PESA" | "Card" | "Wallet">("M-PESA");
  const [phone, setPhone] = useState("+254 714 637 437");
  const [isPaying, setIsPaying] = useState(false);
  const amount = 188484;
  const fee = 2827;
  const total = amount + fee;

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const tx = await transactionsService.create({
        item: "iPhone 17 Pro Max",
        seller: "Gadget World",
        sellerId: "gadget-world",
        amount,
        category: "Electronics",
      });
      toast.success(`${currency(total)} secured in escrow.`);
      navigate({ to: "/app/tracking/$id", params: { id: tx.id } });
    } catch {
      toast.error("Payment couldn't be processed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Secure Payment" back="/app" />

      <div className="px-5 pt-4">
        <h1 className="text-2xl font-bold">Confirm & Pay</h1>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3">
          <Shield className="h-4 w-4 text-accent" />
          <p className="text-xs font-medium text-accent">Funds locked in ZUNO escrow until delivery</p>
        </div>

        <dl className="mt-5 space-y-3 rounded-2xl border border-border/40 bg-surface p-4 text-sm">
          <Line label="Item" value="iPhone 17 Pro Max" />
          <Line label="Seller" value="Gadget World ✓" />
          <Line label="Item Amount" value={currency(amount)} />
          <Line label="Escrow Fee" value={currency(fee)} />
          <div className="my-1 h-px bg-border/60" />
          <Line label="Total" value={currency(total)} bold />
        </dl>

        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-accent">PAYMENT METHOD</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(["M-PESA", "Card", "Wallet"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition-colors ${
                method === m ? "border-gold bg-gold/10 text-gold" : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-input px-4 py-3">
          <Phone className="h-4 w-4 text-gold" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-gold" />
          <p className="text-xs text-gold/90">If a seller asks you to send money directly, stop. That's a scam.</p>
        </div>

        <button
          onClick={handlePay}
          disabled={isPaying}
          className="my-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-base font-semibold text-gold-foreground shadow-gold transition-opacity disabled:opacity-60"
        >
          {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          Pay {currency(total)} into Escrow
        </button>
      </div>
    </div>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</dt>
      <dd className={`text-right ${bold ? "text-lg font-bold" : "font-medium"}`}>{value}</dd>
    </div>
  );
}
