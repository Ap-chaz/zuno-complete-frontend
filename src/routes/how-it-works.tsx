import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, PackageCheck, HandCoins, MessagesSquare, AlertTriangle, ScanFace, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { EscrowFlowDiagram } from "@/components/site/EscrowFlowDiagram";
import { APP_URL } from "@/lib/app-url";
import step1Photo from "@/assets/step1-pay-into-vault.webp";
import step2Photo from "@/assets/step2-held-in-escrow.webp";
import step3Photo from "@/assets/step3-funds-released.webp";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How ZUNO escrow works — step by step" },
      {
        name: "description",
        content:
          "Follow the money through ZUNO: deposit into a segregated vault, seller ships, buyer confirms, funds release. Plus the dispute path.",
      },
      { property: "og:title", content: "How ZUNO escrow works — step by step" },
      {
        property: "og:description",
        content: "Every state change in a ZUNO deal — what happens to the money, and when.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    icon: HandCoins,
    eyebrow: "01 · Deposit",
    title: "Buyer pays into ZUNO Escrow",
    body:
      "The buyer pays into ZUNO using the account reference tied to the deal — bank transfer, card, or mobile money depending on region. The money lands in a segregated escrow account — not the seller's personal account. Both parties get a receipt.",
    money: "Held by ZUNO. Untouchable by seller.",
    visual: (
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
        <img
          src={step1Photo}
          alt="Buyer paying into the ZUNO escrow vault"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover"
        />
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    eyebrow: "02 · Hold",
    title: "ZUNO holds while the seller ships",
    body:
      "The seller sees the payment is real inside the ZUNO app and ships the item. Funds cannot be released until the buyer confirms delivery or the auto-release window ends. Both sides can view the same timeline.",
    money: "Sits in the vault. State visible to both sides.",
    visual: (
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
        <img
          src={step2Photo}
          alt="ZUNO escrow status showing funds held while seller ships"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover"
        />
      </div>
    ),
  },
  {
    icon: PackageCheck,
    eyebrow: "03 · Confirm",
    title: "Buyer confirms — ZUNO releases instantly",
    body:
      "When the buyer taps 'Confirm delivery', ZUNO releases the funds to the seller in seconds. If the buyer stays silent past the auto-release window (default 72h after 'shipped'), funds release automatically.",
    money: "Leaves the vault. Lands with the seller.",
    visual: (
      <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
        <img
          src={step3Photo}
          alt="Buyer confirming delivery and funds released to seller"
          width={1536}
          height={1024}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover"
        />
      </div>
    ),
  },
];

function HowItWorks() {
  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="eyebrow">How it works</p>
          <h1 className="text-display-lg mt-4 max-w-[22ch]">
            Follow the money. Every state, every timestamp, both sides see the same thing.
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
            ZUNO's whole job is to be the boring, transparent third party. Here's exactly what
            happens to your money between the moment you pay and the moment the seller gets it.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <EscrowFlowDiagram />
        </div>
      </section>

      {steps.map((s, i) => {
        return (
          <section key={s.title} className="py-20 lg:py-24">
            <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
              <Reveal>
                <div className={"grid items-center gap-12 lg:grid-cols-2 lg:gap-16 " + (i % 2 ? "lg:[&>*:first-child]:order-2" : "")}>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-[12px] gradient-gold text-primary-foreground shadow-gold">
                        <s.icon className="h-5 w-5" strokeWidth={2} />
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{s.eyebrow}</span>
                    </div>
                    <h2 className="text-heading-lg mt-5 max-w-[22ch]">{s.title}</h2>
                    <p className="mt-4 text-muted-foreground">{s.body}</p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 text-[12px] font-mono text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {s.money}
                    </div>
                  </div>
                  <div>{s.visual}</div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}


      {/* Verification */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Who's on the other end</p>
            <h2 className="text-heading-lg mt-4 max-w-[24ch]">
              Escrow protects the money. Verification tells you who you're dealing with.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Every seller starts unverified. Before their listings can accept escrow deals, they
              move through a verification queue — and buyers can see that status on every listing.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Reveal delay={0}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
                <ScanFace className="h-6 w-6 text-primary" strokeWidth={2} />
                <p className="mt-4 font-semibold">Identity check</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  National ID verification plus a biometric selfie match — the person behind the
                  account has to match the document.
                </p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
                <BadgeCheck className="h-6 w-6 text-primary" strokeWidth={2} />
                <p className="mt-4 font-semibold">Business documentation</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sellers running a registered business submit company registration and tax
                  documents. This moves them into a reviewed "pending" state before approval.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
                <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={2} />
                <p className="mt-4 font-semibold">Visible status, always</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every seller shows as unverified, pending, or verified. If a seller is later
                  flagged for abuse, that status is visible before you pay.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dispute path */}
      <section className="py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Reveal>
            <p className="eyebrow">The dispute path</p>
            <h2 className="text-heading-lg mt-4 max-w-[22ch]">
              When buyer and seller disagree, the money doesn't move.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Either side can open a dispute before funds release. The vault freezes. Both parties
              upload evidence — tracking, photos, chat logs. ZUNO reviews and rules. No party
              can withdraw unilaterally.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><MessagesSquare className="mt-0.5 h-4 w-4 text-primary" /> Both sides can post messages inside the case.</li>
              <li className="flex gap-3"><AlertTriangle className="mt-0.5 h-4 w-4 text-primary" /> ZUNO responds within 24 business hours.</li>
              <li className="flex gap-3"><PackageCheck className="mt-0.5 h-4 w-4 text-primary" /> No proof of shipment within 48h means a full refund to the buyer.</li>
              <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-primary" /> Funds stay in the vault until the case closes, and every ruling comes with a written rationale.</li>
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[22px] border border-border gradient-card p-8">
              <DisputeDiagram />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 text-center">
        <a
          href={APP_URL}
          className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-gold hover:opacity-95"
        >
          Try ZUNO on your next deal <ArrowRight className="h-4 w-4" />
        </a>
      </section>
    </>
  );
}

function DisputeDiagram() {
  return (
    <svg viewBox="0 0 420 240" className="w-full">
      <defs>
        <marker id="arrow-mut" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--color-muted-foreground)" />
        </marker>
      </defs>
      <rect x="150" y="20" width="120" height="52" rx="14" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" />
      <text x="210" y="52" textAnchor="middle" fontSize="12" fill="var(--color-foreground)" fontFamily="Space Grotesk" fontWeight="600">ZUNO Escrow (frozen)</text>

      <rect x="20" y="120" width="120" height="42" rx="12" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="1.2" />
      <text x="80" y="146" textAnchor="middle" fontSize="11" fill="var(--color-foreground)" fontFamily="Inter">Buyer evidence</text>
      <rect x="280" y="120" width="120" height="42" rx="12" fill="none" stroke="var(--color-muted-foreground)" strokeWidth="1.2" />
      <text x="340" y="146" textAnchor="middle" fontSize="11" fill="var(--color-foreground)" fontFamily="Inter">Seller evidence</text>

      <rect x="150" y="190" width="120" height="42" rx="12" fill="var(--color-primary)" opacity="0.9" />
      <text x="210" y="216" textAnchor="middle" fontSize="11" fill="var(--color-primary-foreground)" fontFamily="Inter" fontWeight="600">Case ruling</text>

      <path d="M80 120 C 100 90, 160 80, 200 72" stroke="var(--color-muted-foreground)" strokeWidth="1.2" fill="none" markerEnd="url(#arrow-mut)" strokeDasharray="4 4" />
      <path d="M340 120 C 320 90, 260 80, 220 72" stroke="var(--color-muted-foreground)" strokeWidth="1.2" fill="none" markerEnd="url(#arrow-mut)" strokeDasharray="4 4" />
      <path d="M210 72 L 210 190" stroke="var(--color-primary)" strokeWidth="1.6" strokeDasharray="6 6" markerEnd="url(#arrow-mut)" />
    </svg>
  );
}
