import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Link2,
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/zuno/TopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { transactionsService, formatCurrency } from "@/services/transactions.service";
import type { Transaction } from "@/types/models";

export const Route = createFileRoute("/app/safepay")({
  head: () => ({ meta: [{ title: "Payment Links — ZUNO" }] }),
  component: () => <SafePayPage backTo="/app" />,
});

/** Turns a transaction id into a shareable payment link. */
function linkFor(id: string) {
  return `https://zuno.app/pay/${id}`;
}

/** Accepts either a full link or a bare code and returns just the code. */
function extractCode(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const parts = trimmed.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? trimmed;
}

export function SafePayPage({ backTo = "/app", startHref = "/app/new-escrow" }: { backTo?: string; startHref?: string }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Payment Links" back={backTo} />

      <div className="px-5 pt-4 pb-8">
        <div className="rounded-3xl border border-border/40 bg-gradient-card p-5 shadow-elevated">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-gold" /> SAFEPAY
          </div>
          <h1 className="mt-2 text-lg font-bold leading-snug">
            Get paid, or pay someone, with a single link.
          </h1>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Every payment link is backed by ZUNO escrow — funds stay held until the buyer confirms delivery.
          </p>
        </div>

        <Tabs defaultValue="get-paid" className="mt-5 w-full">
          <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-surface p-1">
            <TabsTrigger
              value="get-paid"
              className="h-full rounded-xl text-sm font-semibold data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow-gold"
            >
              <Link2 className="mr-1.5 h-4 w-4" /> Get Paid
            </TabsTrigger>
            <TabsTrigger
              value="pay-link"
              className="h-full rounded-xl text-sm font-semibold data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow-gold"
            >
              <KeyRound className="mr-1.5 h-4 w-4" /> Pay a Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="get-paid" className="mt-5">
            <GetPaidTab startHref={startHref} />
          </TabsContent>
          <TabsContent value="pay-link" className="mt-5">
            <PayLinkTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ---------------- Get Paid ---------------- */
function GetPaidTab({ startHref }: { startHref: string }) {
  const { user } = useAuth();
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [creating, setCreating] = useState(false);
  const [link, setLink] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  const amountNum = Number(amount.replace(/[^\d]/g, "")) || 0;
  const valid = item.trim().length > 0 && amountNum > 0;

  const handleGenerate = async () => {
    if (!valid || creating) return;
    setCreating(true);
    try {
      const created = await transactionsService.create({
        item: item.trim(),
        seller: user?.name ?? "You",
        sellerId: user?.id ?? "you",
        buyerName: undefined,
        amount: amountNum,
        currency: "KES",
        category,
      });
      setLink(created);
      toast.success("Payment link generated");
    } catch {
      toast.error("Couldn't generate a link — please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(linkFor(link.id));
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — select and copy manually.");
    }
  };

  if (link) {
    return (
      <div>
        <div className="rounded-3xl border border-gold/30 bg-gold/5 p-5 text-center shadow-card">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-gold-foreground">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-base font-bold">Payment link ready</h2>
          <p className="mt-1 text-2xl font-bold text-gold">{formatCurrency(link.amount)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{link.item}</p>
        </div>

        <p className="mt-5 px-1 text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
          SHARE THIS LINK
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border/40 bg-surface p-2 pl-4">
          <span className="flex-1 truncate text-sm text-muted-foreground">{linkFor(link.id)}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy link"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold text-gold-foreground"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Send this to your buyer. Once they pay, funds are held in ZUNO escrow until you deliver and they confirm.
        </p>

        <button
          onClick={() => {
            setLink(null);
            setItem("");
            setAmount("");
          }}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl border border-border/40 bg-surface text-sm font-semibold"
        >
          Create another link
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <Field label="What are you selling?" value={item} onChange={setItem} placeholder="e.g. iPhone 17 Pro Max" />
        <Field
          label="Amount (KES)"
          value={amount}
          onChange={(v) => setAmount(v.replace(/[^\d]/g, ""))}
          placeholder="0"
          inputMode="numeric"
        />
        <Select
          label="Category"
          value={category}
          onChange={setCategory}
          options={["Electronics", "Fashion", "Furniture", "Vehicles", "Services", "Other"]}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!valid || creating}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold font-semibold text-gold-foreground shadow-card transition-opacity active:scale-[0.98] disabled:opacity-40"
      >
        {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
        Generate Payment Link
      </button>

      <Link
        to={startHref}
        className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        Prefer the guided flow instead? <span className="text-gold">Start a protected deal</span>
        <ArrowRight className="h-3.5 w-3.5 text-gold" />
      </Link>
    </div>
  );
}

/* ---------------- Pay a Link ---------------- */
function PayLinkTab() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [preview, setPreview] = useState<Transaction | null>(null);
  const [paying, setPaying] = useState(false);

  const handleReview = async () => {
    const code = extractCode(input);
    if (!code || checking) return;
    setChecking(true);
    setPreview(null);
    try {
      const tx = await transactionsService.getById(code);
      if (tx.status !== "Pending") {
        toast.error("This link has already been paid or is no longer active.");
        return;
      }
      setPreview(tx);
    } catch {
      toast.error("We couldn't find a payment link with that code.");
    } finally {
      setChecking(false);
    }
  };

  const handlePay = async () => {
    if (!preview || paying) return;
    setPaying(true);
    try {
      const updated = await transactionsService.updateStatus(preview.id, "Funded");
      toast.success("Payment sent into escrow");
      navigate({ to: "/app/tracking/$id", params: { id: updated.id } });
    } catch {
      toast.error("Payment failed — please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (preview) {
    return (
      <div>
        <div className="rounded-3xl border border-border/40 bg-surface p-5 shadow-card">
          <p className="text-[11px] font-bold tracking-[0.18em] text-muted-foreground">YOU'RE PAYING</p>
          <ConfRow label="Item" value={preview.item} />
          <ConfRow label="Seller" value={preview.seller} />
          <ConfRow label="Amount" value={formatCurrency(preview.amount)} strong />
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold/25 bg-gold/5 p-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Your payment is held securely in escrow until you confirm delivery. Refunds are protected.
          </p>
        </div>

        <button
          onClick={handlePay}
          disabled={paying}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold font-semibold text-gold-foreground shadow-card transition-opacity active:scale-[0.98] disabled:opacity-60"
        >
          {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Pay {formatCurrency(preview.amount)} into Escrow
        </button>
        <button
          onClick={() => setPreview(null)}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-2xl border border-border/40 bg-surface text-sm font-medium text-muted-foreground"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div>
      <Field
        label="Payment link or code"
        value={input}
        onChange={setInput}
        placeholder="Paste a link or code (e.g. ZUNOAXFVLO4Y8Y)"
      />
      <button
        onClick={handleReview}
        disabled={!input.trim() || checking}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gold font-semibold text-gold-foreground shadow-card transition-opacity active:scale-[0.98] disabled:opacity-40"
      >
        {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Review &amp; Pay into Escrow
      </button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        Enter the link or code shared by the seller. Your payment is held securely in escrow until you confirm delivery.
      </p>
    </div>
  );
}

/* ---------------- Shared bits ---------------- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full rounded-2xl border border-border/40 bg-surface px-4 py-3 text-sm outline-none focus:border-gold/60"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border/40 bg-surface px-4 py-3 text-sm outline-none focus:border-gold/60"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ConfRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="mt-3 flex items-start justify-between gap-4 border-t border-border/30 pt-3 first:border-t-0 first:pt-3">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`max-w-[60%] text-right text-xs ${strong ? "font-bold text-gold" : "font-medium"}`}>{value}</span>
    </div>
  );
}
