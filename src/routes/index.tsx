import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Smartphone, MessageCircle, ArrowLeftRight, Ban, HandCoins, ScrollText, RadioTower } from "lucide-react";
import heroRotateComingSoon from "@/assets/hero-rotate-coming-soon.jpg";
import heroRotateEscrowBanner from "@/assets/hero-rotate-escrow-banner.png";
import heroRotatePhone from "@/assets/hero-rotate-phone.webp";
import { HeroRotator } from "@/components/site/HeroRotator";
import paymentRailsPhoto from "@/assets/payment-rails.webp";
import messagingEscrowPhoto from "@/assets/messaging-escrow.webp";
import noAppNeededPhoto from "@/assets/no-app-needed.webp";
import comingSoonInsurancePhoto from "@/assets/coming-soon-insurance.webp";
import step1PhotoLight from "@/assets/payment-methods-icons-light.webp";
import step1PhotoDark from "@/assets/payment-methods-icons-dark.webp";
import disputePathDiagramLight from "@/assets/dispute-path-diagram-light.webp";
import disputePathDiagramDark from "@/assets/dispute-path-diagram-dark.webp";
import orderProgressDiagramLight from "@/assets/order-progress-diagram-light.webp";
import orderProgressDiagramDark from "@/assets/order-progress-diagram-dark.webp";
import { EscrowFlowDiagram } from "@/components/site/EscrowFlowDiagram";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZUNO Escrow — Hold the money. Not the risk." },
      {
        name: "description",
        content:
          "ZUNO is a neutral escrow account for online marketplace deals. Funds stay in a segregated vault until buyer and seller both confirm.",
      },
      { property: "og:title", content: "ZUNO Escrow — Hold the money. Not the risk." },
      {
        property: "og:description",
        content: "Pay sellers you've never met — without the leap of faith.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowSection />
      <FeatureNarrative />
      <TrustStrip />
      <ByTheNumbers />
      <BuiltForGlobalCommerce />
      <PersonaSection />
      <FinalCta />
    </>
  );
}

/* ────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-24 lg:pt-28 lg:pb-28">
      <div className="mx-auto max-w-[820px] px-6 text-center lg:px-8">
        <h1 className="text-display-xl mx-auto max-w-[16ch]">
          Hold the <span className="text-primary">money.</span>{" "}
          Not the risk.
        </h1>

        <p className="mt-6 text-body-lg text-muted-foreground">
          ZUNO is a neutral escrow account for online marketplace, social, and direct-message
          deals. Your payment sits in a segregated ZUNO Escrow account — the seller can't touch
          it until you confirm the item arrived.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth/signup"
            className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-gold transition-transform hover:opacity-95 active:scale-[0.98]"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold text-foreground hover:text-primary"
          >
            See how escrow works →
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
          <span>Funds held in a segregated account</span>
          <span aria-hidden className="text-border">·</span>
          <span>Released only on confirmation</span>
          <span aria-hidden className="text-border">·</span>
          <Link to="/pricing" className="hover:text-primary">
            1–2.5% fee, split between buyer and seller, based on item category
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-[1200px] px-6 lg:px-8">
        <HeroRotator
          slides={[
            { src: heroRotateComingSoon, alt: "ZUNO coming soon", width: 1600, height: 1200 },
            { src: heroRotateEscrowBanner, alt: "ZUNO — Escrow. Trusted. Secured.", width: 1448, height: 1086 },
            { src: heroRotatePhone, alt: "A ZUNO user holding a phone showing the ZUNO app logo", width: 1600, height: 1200 },
          ]}
        />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function ProblemSection() {
  return (
    <section className="relative py-24 lg:py-32">

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <p className="eyebrow">The problem, plainly stated</p>
          <h2 className="text-heading-lg mt-4 max-w-[20ch]">
            Most online marketplace deals still run on trust that isn't there.
          </h2>
          <p className="mt-5 text-muted-foreground">
            A buyer sees an item on a marketplace or social listing. The seller wants full payment
            before shipping. The buyer sends money to a stranger — and either the parcel arrives, or
            it doesn't, and the money is gone. Legitimate sellers lose sales for the same reason
            fraudsters get paid: neither side can prove they're trustworthy.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "Once you send money directly to a stranger, you have no chargeback.",
              "Honest sellers can't compete with the risk-free DM handshake.",
              "Disputes usually end in a screenshot war, not a resolution.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Ban className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-[24px] border border-border gradient-card p-8 shadow-card">
            <p className="eyebrow">Before → After</p>
            <div className="mt-6 space-y-6">
              <FlowRow
                label="Without escrow"
                tone="danger"
                left="Buyer"
                right="Seller"
                note="Direct payment. No recourse if the item never ships."
              />
              <FlowRow
                label="With ZUNO"
                tone="ok"
                left="Buyer"
                mid="ZUNO Escrow"
                right="Seller"
                note="Money held until buyer confirms delivery."
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FlowRow({
  label, tone, left, mid, right, note,
}: { label: string; tone: "danger" | "ok"; left: string; mid?: string; right: string; note: string }) {
  const color = tone === "danger" ? "var(--color-destructive)" : "var(--color-primary)";
  return (
    <div>
      <div className="flex items-center gap-2 text-xs">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-[14px] border border-border bg-surface px-4 py-4 text-sm font-medium">
        <span>{left}</span>
        {mid ? (
          <>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="rounded-[10px] px-3 py-1 font-mono text-xs" style={{ background: "color-mix(in oklab, var(--color-primary) 16%, transparent)", color: "var(--color-primary)" }}>{mid}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </>
        ) : (
          <ArrowRight className="h-4 w-4" style={{ color }} />
        )}
        <span>{right}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function HowSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="max-w-[46ch]">
          <p className="eyebrow">How ZUNO works</p>
          <h2 className="text-heading-lg mt-4">Three moves. The money is never in the wrong hands.</h2>
          <p className="mt-4 text-muted-foreground">
            ZUNO sits between buyer and seller as the temporary custodian of the funds. Each side
            can see exactly where the money is, at every moment.
          </p>
        </Reveal>

        <div className="mt-14">
          <EscrowFlowDiagram />
        </div>

        <div className="mt-10">
          <Link to="/how-it-works" className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--gold-text)] hover:opacity-90">
            Read the full step-by-step <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function FeatureNarrative() {
  const features = [
    {
      eyebrow: "Multiple ways to pay",
      title: "Pay the way that works for you.",
      body: "ZUNO deposits and payouts run on bank transfer, card, and local mobile money rails depending on your region — no crypto detour, no waiting on a bank branch. If you can move money on your phone, you can use escrow.",
      visual: <FeaturePayment />,
      side: "right" as const,
    },
    {
      eyebrow: "Real dispute path",
      title: "If something goes wrong, a human reads the evidence.",
      body: "When buyer and seller disagree, ZUNO opens a dispute case. Both sides upload receipts, tracking numbers, and photos. Funds stay in the vault until the case is resolved — never released by default.",
      visual: <FeatureDispute />,
      side: "left" as const,
    },
    {
      eyebrow: "Live tracking",
      title: "You always know where the money is.",
      body: "Every state change — payment received, item shipped, delivery confirmed, funds released — is timestamped and visible to both sides in real time. No 'let me check with my boss' delays.",
      visual: <FeatureTracking />,
      side: "right" as const,
    },
  ];

  return (
    <>
      {features.map((f) => (
        <section key={f.title} className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
            <Reveal>
              <div
                className={
                  "grid items-center gap-12 lg:grid-cols-2 lg:gap-16 " +
                  (f.side === "left" ? "" : "lg:[&>*:first-child]:order-2")
                }
              >
                <div>
                  <p className="eyebrow">{f.eyebrow}</p>
                  <h3 className="text-heading-lg mt-4 max-w-[20ch]">{f.title}</h3>
                  <p className="mt-5 max-w-xl text-muted-foreground">{f.body}</p>
                </div>
                <div className="relative">{f.visual}</div>
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}


function FeaturePayment() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <img
        src={step1PhotoLight}
        alt="Payment method icons: M-Pesa, QR payment, debit card, bank transfer, and credit card"
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover dark:hidden"
      />
      <img
        src={step1PhotoDark}
        alt="Payment method icons: M-Pesa, QR payment, debit card, bank transfer, and credit card"
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
        className="hidden h-auto w-full object-cover dark:block"
      />
    </div>
  );
}

function FeatureDispute() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <img
        src={disputePathDiagramLight}
        alt="ZUNO escrow dispute path: dispute raised, ZUNO review, evidence submitted, decision made, funds released, dispute resolved"
        width={1254}
        height={1254}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover dark:hidden"
      />
      <img
        src={disputePathDiagramDark}
        alt="ZUNO escrow dispute path: dispute raised, ZUNO review, evidence submitted, decision made, funds released, dispute resolved"
        width={1254}
        height={1254}
        loading="lazy"
        decoding="async"
        className="hidden h-auto w-full object-cover dark:block"
      />
    </div>
  );
}

function FeatureTracking() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
      <img
        src={orderProgressDiagramLight}
        alt="Order progress: payment secured by ZUNO, seller preparing order, delivery in progress, order completed, confirm delivery and release funds"
        width={1538}
        height={659}
        loading="lazy"
        decoding="async"
        className="h-auto w-full object-cover dark:hidden"
      />
      <img
        src={orderProgressDiagramDark}
        alt="Order progress: payment secured by ZUNO, seller preparing order, delivery in progress, order completed, confirm delivery and release funds"
        width={1600}
        height={685}
        loading="lazy"
        decoding="async"
        className="hidden h-auto w-full object-cover dark:block"
      />
    </div>
  );
}

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 text-[13px]">
      <span className="text-muted-foreground">{k}</span>
      <span className={"font-mono " + (highlight ? "text-primary" : "text-foreground")}>{v}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function TrustStrip() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Funds segregated from ZUNO's operating account",
      body: "Buyer money is held in a separate trust account. It is never used to fund ZUNO's own business — if ZUNO paused tomorrow, the money is still yours.",
    },
    {
      icon: ScrollText,
      title: "Every transaction has a written audit trail",
      body: "Timestamped state changes, payment reference numbers, and dispute logs — all retrievable by both sides for the life of the transaction.",
    },
    {
      icon: RadioTower,
      title: "TLS everywhere · encrypted at rest",
      body: "Payment details, IDs and dispute evidence are encrypted in storage. We collect the minimum PII required to move money legally.",
    },
  ];
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="max-w-[52ch]">
          <p className="eyebrow">Trust posture, stated plainly</p>
          <h2 className="text-heading-lg mt-4">
            We won't ask you to trust the brand. We'll show you the mechanism.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 60}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
                <div className="grid h-11 w-11 place-items-center rounded-[12px] bg-surface-2 text-primary">
                  <it.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-[18px] font-semibold leading-snug">{it.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={180}>
          <p className="mt-6 text-sm text-muted-foreground">
            ZUNO operates under Kenyan consumer protection and payment services frameworks and is
            progressing toward CBK Payment Service Provider licensing. Current status and licensing
            partner disclosed on request — see{" "}
            <Link to="/security" className="font-semibold text-[color:var(--gold-text)] hover:opacity-90">
              Security &amp; compliance
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function ByTheNumbers() {
  const stats = [
    { value: "3", label: "Payment rails at launch — bank, card, mobile money" },
    { value: "100%", label: "Of buyer funds held in a segregated trust account" },
    { value: "0", label: "Times ZUNO can touch escrowed funds before both sides confirm" },
    { value: "Dec 2026", label: "Target date for the ZUNO MVP launch" },
  ];

  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="max-w-[52ch]">
          <p className="eyebrow">Where things actually stand</p>
          <h2 className="text-heading-lg mt-4">
            No case studies yet. Just what's true right now.
          </h2>
          <p className="mt-4 text-muted-foreground">
            ZUNO is pre-launch — so instead of manufacturing quotes, here's the real state of
            the build.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <div className="h-full rounded-[20px] border border-border bg-surface p-6 shadow-card">
                <p className="font-display text-[34px] font-bold leading-none text-[color:var(--gold-text)]">
                  {s.value}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function BuiltForGlobalCommerce() {
  const items: { icon: typeof Smartphone; image?: string; imgWidth?: number; imgHeight?: number; k: string; v: string }[] = [
    { icon: Smartphone, image: paymentRailsPhoto, imgWidth: 1672, imgHeight: 940, k: "Multiple payment rails", v: "Bank transfer, card, and local mobile money — whatever moves money fastest in your region." },
    { icon: MessageCircle, image: messagingEscrowPhoto, imgWidth: 1536, imgHeight: 1024, k: "Works over DMs & marketplaces", v: "Share a ZUNO link in a chat or listing. The other side pays without an app." },
    { icon: ArrowLeftRight, image: noAppNeededPhoto, imgWidth: 1536, imgHeight: 1024, k: "No app to download to start", v: "Escrow is initiated from a plain web link — buyer or seller." },
  ];
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8">
        <Reveal>
          <p className="eyebrow">Built for how people actually transact online</p>
          <h2 className="text-heading-lg mt-4 max-w-[16ch]">
            Not a generic escrow SDK bolted onto a checkout page.
          </h2>
          <p className="mt-4 text-muted-foreground">
            ZUNO is designed around the places online deals actually happen: direct messages,
            marketplace listings, and social platforms. Everything else is secondary.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={i * 60}>
              {it.image ? (
                <div className="overflow-hidden rounded-[18px] border border-border bg-surface">
                  <img
                    src={it.image}
                    alt={it.k}
                    width={it.imgWidth}
                    height={it.imgHeight}
                    loading="lazy"
                    decoding="async"
                    className="h-44 w-full object-cover sm:h-48"
                  />
                  <div className="p-6">
                    <p className="font-semibold">{it.k}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{it.v}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[18px] border border-border bg-surface p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-surface-2 text-primary">
                    <it.icon className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <p className="mt-4 font-semibold">{it.k}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{it.v}</p>
                </div>
              )}
            </Reveal>
          ))}
          <Reveal delay={180}>
            <div className="overflow-hidden rounded-[18px] border border-primary/40 gradient-card">
              <img
                src={comingSoonInsurancePhoto}
                alt="Coming soon — Escrow. Trusted. Secured."
                width={1536}
                height={1024}
                loading="lazy"
                decoding="async"
                className="h-44 w-full object-cover sm:h-48"
              />
              <div className="p-6">
                <p className="font-semibold">Physical goods insurance layer</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Optional cover on high-value shipments, priced per transaction.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function PersonaSection() {
  const personas = [
    {
      role: "For buyers",
      quote: "I want to buy a used lens from someone I've never met, three time zones away.",
      body: "Pay into ZUNO. The seller sees the money is real and ships. The moment the lens arrives and works, you confirm and the seller gets paid — instantly.",
      to: "/for-buyers",
    },
    {
      role: "For sellers",
      quote: "I lose 4 out of 10 legitimate buyers because they don't trust I'll ship.",
      body: "Send a ZUNO link instead of your bank details. Buyers pay because the money is protected. You ship confidently — the funds are guaranteed once delivery is confirmed.",
      to: "/for-sellers",
    },
  ];
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="max-w-[52ch]">
          <p className="eyebrow">Who ZUNO is for</p>
          <h2 className="text-heading-lg mt-4">Two people in one deal. Both protected.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {personas.map((p, i) => (
            <Reveal key={p.role} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[22px] border border-border gradient-card p-8 shadow-card">
                <p className="eyebrow">{p.role}</p>
                <blockquote className="mt-4 text-[22px] font-display font-semibold tracking-tight text-foreground">
                  “{p.quote}”
                </blockquote>
                <p className="mt-4 text-muted-foreground">{p.body}</p>
                <Link
                  to={p.to}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--gold-text)] hover:opacity-90"
                >
                  Read the {p.role.toLowerCase().replace("for ", "")} playbook <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36">

      <div className="relative mx-auto max-w-[720px] px-6 text-center">
        <Reveal>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] gradient-gold text-primary-foreground shadow-gold">
            <HandCoins className="h-6 w-6" strokeWidth={2} />
          </div>
          <h2 className="text-display-lg mt-6">Stop taking the leap of faith.</h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            ZUNO opens to a small group of buyers and sellers first. Get in early.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-gold transition-transform hover:opacity-95 active:scale-[0.98]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
