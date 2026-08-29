import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";
import {
  CATEGORIES,
  FEE_TIERS,
  FEE_TIER_ORDER,
  calculateFeeForTier,
  formatFeePct,
  formatKES,
  type FeeTierId,
} from "@/lib/fees";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ZUNO Escrow" },
      {
        name: "description",
        content:
          "A transparent per-transaction fee that scales with what you're trading, split evenly between buyer and seller. See exactly what you'll deposit and what the seller will receive, in KES, before you commit.",
      },
      { property: "og:title", content: "Pricing — ZUNO Escrow" },
      { property: "og:description", content: "A transparent, category-based fee. Nothing else." },
    ],
  }),
  component: PricingPage,
});

const EXAMPLE_PRICE = 125;

function PricingPage() {
  const [amount, setAmount] = useState(String(EXAMPLE_PRICE));
  const [tierId, setTierId] = useState<FeeTierId>("low");

  const tier = FEE_TIERS[tierId];
  const categoriesInTier = CATEGORIES.filter((c) => c.tier === tierId);

  const calc = useMemo(() => {
    const n = Math.max(0, Number(amount.replace(/[^0-9.]/g, "")) || 0);
    return calculateFeeForTier(n, tierId);
  }, [amount, tierId]);

  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="eyebrow">Pricing</p>
          <h1 className="text-display-lg mt-4 max-w-[20ch]">
            One fee per deal, scaled to what's actually at risk.
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
            ZUNO charges between{" "}
            <span className="text-foreground font-semibold">1% and 2.5% of the transaction value</span>,
            depending on the category of item being traded — split evenly between buyer and
            seller. Higher-value, higher-risk goods carry a higher fee because they carry more
            dispute risk and more verification work.
          </p>
        </div>
      </section>

      {/* Interactive calculator */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8">
          <Reveal>
            <div className="rounded-[24px] border border-border gradient-card p-8 shadow-elevated">
              <p className="eyebrow">Category</p>
              <div className="mt-3 grid gap-2 grid-cols-3">
                {FEE_TIER_ORDER.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTierId(id)}
                    className={
                      "rounded-[12px] border px-3 py-3 text-left text-sm transition-colors " +
                      (id === tierId
                        ? "border-primary bg-[color-mix(in_oklab,var(--color-primary)_12%,transparent)]"
                        : "border-border bg-surface hover:bg-surface-2")
                    }
                  >
                    <span className="block font-semibold">{FEE_TIERS[id].label}</span>
                    <span className="mt-1 block font-mono text-xs text-muted-foreground">
                      {formatFeePct(FEE_TIERS[id].feePct)}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {categoriesInTier.length > 0
                  ? categoriesInTier.map((c) => c.label).join(" · ")
                  : "Commodities for this tier to be finalized."}
              </p>

              <label htmlFor="amt" className="eyebrow mt-6 block">Item price</label>
              <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-border bg-surface px-4 py-3">
                <span className="font-mono text-sm text-muted-foreground">KES</span>
                <input
                  id="amt"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent font-mono text-3xl font-semibold text-foreground focus:outline-none"
                />
              </div>

              <dl className="mt-8 space-y-4">
                <Row label="Item price" value={calc.itemPrice} strong />
                <Row
                  label={`Total fee (${formatFeePct(calc.totalFeePct)}, split 50/50)`}
                  value={calc.totalFeeAmount}
                  muted
                />
                <div className="my-3 border-t border-border/60" />
                <Row label="Buyer deposits" value={calc.buyerDeposit} accent />
                <Row label="Seller receives on release" value={calc.sellerPayout} accent />
              </dl>

              <p className="mt-6 text-xs text-muted-foreground">
                Fee is paid once per deal, half by each side. There is no monthly subscription,
                no listing fee, and no fee on refunded transactions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-6">
              <Point k="Why the fee varies" v="Higher-value and higher-risk categories mean more verification work and more exposure if a dispute goes wrong — the fee reflects that, not the size of the sale for its own sake." />
              <Point k="Split evenly, always" v="Half the fee comes out of the buyer's deposit, half comes out of the seller's payout. Neither side carries the full cost." />
              <Point k="Refunds cost nothing" v="If the deal falls through and funds return to the buyer, ZUNO does not charge a fee." />
              <Point k="High-volume seller?" v="If you run a shop and settle many deals per week, get in touch — we'll set up an aggregated invoice."
              />
              <Link to="/auth/signup" className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--gold-text)]">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Per-tier worked examples, so visitors don't have to calculate manually */}
      <section className="py-16 lg:py-24 border-t border-border/60">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <Reveal className="max-w-[52ch]">
            <p className="eyebrow">Worked examples</p>
            <h2 className="text-heading-lg mt-4">
              What a KES {EXAMPLE_PRICE.toLocaleString("en-KE")} deal looks like in each tier.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEE_TIER_ORDER.map((tierId, i) => (
              <TierExampleCard key={tierId} tierId={tierId} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TierExampleCard({ tierId, delay }: { tierId: FeeTierId; delay: number }) {
  const tier = FEE_TIERS[tierId];
  const example = calculateFeeForTier(EXAMPLE_PRICE, tierId);
  const categoriesInTier = CATEGORIES.filter((c) => c.tier === tierId);

  return (
    <Reveal delay={delay}>
      <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
        <p className="eyebrow">{tier.label}</p>
        <p className="mt-2 font-mono text-2xl font-semibold text-[color:var(--gold-text)]">
          {formatFeePct(tier.feePct)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{tier.description}</p>

        <dl className="mt-5 space-y-2 border-t border-border/60 pt-4">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Item price</dt>
            <dd className="font-mono">{formatKES(example.itemPrice)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Buyer deposits</dt>
            <dd className="font-mono font-semibold">{formatKES(example.buyerDeposit)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <dt className="text-muted-foreground">Seller receives</dt>
            <dd className="font-mono font-semibold">{formatKES(example.sellerPayout)}</dd>
          </div>
        </dl>

        <p className="mt-5 text-xs text-muted-foreground">
          {categoriesInTier.map((c) => c.label).join(" · ")}
        </p>
      </div>
    </Reveal>
  );
}

function Row({ label, value, strong, muted, accent }: { label: string; value: number; strong?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={"text-sm " + (muted ? "text-muted-foreground" : "text-foreground")}>{label}</dt>
      <dd className={
        "font-mono " +
        (accent ? "text-2xl text-primary font-semibold" : strong ? "text-xl font-semibold" : "text-base text-muted-foreground")
      }>
        {formatKES(value)}
      </dd>
    </div>
  );
}

function Point({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-5">
      <p className="font-semibold">{k}</p>
      <p className="mt-2 text-sm text-muted-foreground">{v}</p>
    </div>
  );
}
