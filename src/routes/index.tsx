import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  HandCoins,
  ScrollText,
  RadioTower,
  Scale,
  Ban,
  Repeat2,
  Lock,
  Wallet,
  PackageCheck,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Logo } from "@/components/zuno/Logo";

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
      <div className="relative z-10 bg-background">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border/60 bg-surface px-6 py-4 text-[13px] text-muted-foreground">
          <span>Funds held in a segregated account</span>
          <span aria-hidden className="text-border">·</span>
          <span>Released only on confirmation</span>
          <span aria-hidden className="text-border">·</span>
          <Link to="/pricing" className="hover:text-primary">
            1–2.5% fee, split between buyer and seller, based on item category
          </Link>
        </div>
        <RailsMarquee />
        <ChapterProblem />
        <ChapterSolution />
        <ChapterPreview />
        <ChapterVault />
        <ChapterFeatures />
        <ChapterProof />
        <ChapterBegin />
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Small running label used at the top of every numbered
   chapter — reads like a page marker in a ledger.               */

function ChapterMark({ n, of = 4, title }: { n: number; of?: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[12px] tracking-[0.1em] text-muted-foreground">
        {String(n).padStart(2, "0")} / {String(of).padStart(2, "0")}
      </span>
      <span aria-hidden className="h-px w-8 bg-border" />
      <span className="eyebrow">{title}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

// The hero video is designed to sit on a dark backdrop (a soft dark
// vignette lets it read clearly). It stays this fixed dark color even
// though the rest of the marketing site is light-only, so the video
// never gets washed out by the light theme background.
const HERO_DARK_BG = "oklch(0.16 0.035 265)";

function Hero() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative overflow-hidden text-center">
      {/* Spacer: reserves scroll height in normal flow, since the pinned
          layer below is `fixed` and removed from flow. */}
      <div aria-hidden className="h-[100svh]" />

      {/* Pinned layer: stays locked to the viewport while every chapter
          after Hero (wrapped as relative z-10 in Home()) scrolls up and
          covers it — video + headline never move, exactly like the
          reference site's hero. */}
      <div
        className="fixed inset-0 z-0 flex h-[100svh] flex-col justify-center overflow-hidden py-24"
        style={{ backgroundColor: HERO_DARK_BG }}
      >
        {!videoFailed && (
          <video
            aria-hidden
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 45%" }}
          >
            <source src="/videos/hero-v2.mp4" type="video/mp4" />
          </video>
        )}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: videoFailed
              ? undefined
              : `linear-gradient(180deg, color-mix(in oklab, ${HERO_DARK_BG} 55%, transparent), ${HERO_DARK_BG} 92%)`,
            backgroundImage: videoFailed
              ? "radial-gradient(55% 45% at 50% 30%, color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 70%)"
              : undefined,
          }}
        />
        {videoFailed && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(color-mix(in oklab, var(--color-primary) 60%, transparent) 1px, transparent 1.5px)",
                backgroundSize: "26px 26px",
                maskImage: "radial-gradient(60% 50% at 50% 35%, black, transparent 75%)",
                WebkitMaskImage: "radial-gradient(60% 50% at 50% 35%, black, transparent 75%)",
              }}
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-[28%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
              style={{
                animation: "zuno-pulse 2.6s ease-in-out infinite",
                boxShadow: "0 0 70px 35px color-mix(in oklab, var(--color-primary) 35%, transparent)",
              }}
            />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                aria-hidden
                className="absolute left-1/2 top-[28%] h-1.5 w-1.5 rounded-full bg-primary/80"
                style={{
                  offsetPath: "path('M0 0 m -90 0 a 90 90 0 1 0 180 0 a 90 90 0 1 0 -180 0')",
                  animation: `zuno-particle 5s linear ${i * 1.7}s infinite`,
                }}
              />
            ))}
          </>
        )}

        <div className="relative mx-auto max-w-[880px] px-6 lg:px-8">
          <Reveal>
            <h1 className="text-display-xl mx-auto mt-5 max-w-[16ch] text-white">
              Hold the <span className="text-primary">money</span>.<br className="hidden sm:block" /> Not the risk.
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-body-lg text-white/80">
              A neutral escrow account for marketplace, social, and DM deals. Money sits in a
              segregated ZUNO vault — the seller can't touch it until you confirm the item arrived.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/auth/signup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-gold transition-transform hover:opacity-95 active:scale-[0.98]"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-[15px] font-semibold text-white hover:border-primary/60"
              >
                See how escrow works
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* A genuinely-moving strip of real facts about ZUNO's rails —
   not borrowed press logos, since ZUNO doesn't have any yet.
   Each item is a generated badge image; falls back to plain
   text + dot for any item that doesn't have an image yet.       */

function RailsMarquee() {
  const items: { label: string; img?: string }[] = [
    { label: "M-Pesa STK Push", img: "/marquee/mpesa-stk-push.png" },
    { label: "Segregated trust account", img: "/marquee/segregated-trust-account.png" },
    { label: "Encrypted at rest", img: "/marquee/encrypted-at-rest.png" },
    { label: "Human dispute review", img: "/marquee/human-dispute-review.png" },
    { label: "Timestamped audit trail", img: "/marquee/timestamped-audit-trail.png" },
    { label: "Seller verification tiers", img: "/marquee/seller-verification-tiers.png" },
    { label: "WhatsApp-linked deals", img: "/marquee/whatsapp-linked-deals.png" },
  ];
  const loop = [...items, ...items];

  const renderItem = (t: { label: string; img?: string }, i: number) =>
    t.img ? (
      <img
        key={i}
        src={t.img}
        alt={t.label}
        className="h-32 w-auto shrink-0 select-none sm:h-40"
        draggable={false}
      />
    ) : (
      <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t.label}
      </span>
    );

  return (
    <div className="overflow-hidden border-y border-border/50 bg-surface py-8">
      <div className="marquee-mask">
        <div className="marquee-track flex w-max items-center gap-10">
          {loop.map(renderItem)}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Original dot-mosaic icon — a small generative grid, distinct
   from any borrowed iconography, drawn from an ASCII pattern.   */

function DotMosaic({ pattern }: { pattern: string }) {
  const rows = pattern.trim().split("\n");
  return (
    <div className="grid gap-[3px]" style={{ gridTemplateRows: `repeat(${rows.length}, 6px)` }}>
      {rows.map((row, r) => (
        <div key={r} className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${row.length}, 6px)` }}>
          {row.split("").map((c, i) => (
            <span
              key={i}
              className="h-[6px] w-[6px] rounded-[1.5px]"
              style={{ background: c === "#" ? "var(--color-primary)" : "transparent" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/* CHAPTER 01 — THE PROBLEM. Four plain-spoken cards, then a
   full-width statement tile that bridges into the solution.     */

function ChapterProblem() {
  const tiles = [
    {
      pattern: "#.#.#\n.#.#.\n#.#.#\n.#.#.\n#.#.#",
      Icon: Ban,
      title: "Send money, then hope",
      body: "Full payment goes to a stranger before anything ships. If the parcel never comes, there's no chargeback — just a screenshot war.",
    },
    {
      pattern: "##...\n##...\n..##.\n..##.\n...##",
      Icon: Repeat2,
      title: "Every deal starts from zero",
      body: "No shared record either side can point to. Trust gets rebuilt from scratch in every single chat thread.",
    },
    {
      pattern: ".#.#.\n#.#.#\n.###.\n#.#.#\n.#.#.",
      Icon: Lock,
      title: "Honest sellers look risky too",
      body: "From the buyer's side, a legitimate seller and a scammer are indistinguishable — so good sellers lose sales for a stranger's crimes.",
    },
    {
      pattern: ".#...\n#.#..\n.#.#.\n..#.#\n...#.",
      Icon: Scale,
      title: "Disputes have no referee",
      body: "When something goes wrong, it's two people arguing in a DM. Nobody neutral is holding the money — or the facts.",
    },
  ];
  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal className="max-w-[640px]">
          <ChapterMark n={1} title="The problem" />
          <h2 className="text-display-lg mt-6 max-w-[20ch]">
            Commerce moved into chat. Trust never followed it there.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {tiles.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <div className="flex h-full flex-col rounded-[24px] border border-border bg-surface p-7 shadow-card">
                <DotMosaic pattern={t.pattern} />
                <h3 className="mt-6 text-[18px] font-semibold leading-snug">{t.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <div className="relative mt-5 flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-[24px] border border-primary/30 bg-surface-2 p-10 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: "radial-gradient(color-mix(in oklab, var(--color-primary) 80%, transparent) 1px, transparent 1.5px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="relative">
              <Logo size={30} />
              <p className="mx-auto mt-4 max-w-[36ch] font-display text-[22px] font-semibold leading-snug text-foreground">
                The deal doesn't need more trust. It needs a third place for the money to sit.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* CHAPTER 02 — THE SOLUTION. Full-bleed dark room, split into
   two large cards for the two sides of every deal.              */

function ChapterSolution() {
  return (
    <section
      className="relative overflow-hidden py-24 text-white lg:py-32"
      style={{ background: "oklch(0.16 0.035 265)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: "radial-gradient(45% 35% at 15% 15%, color-mix(in oklab, var(--color-primary) 70%, transparent), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow text-primary">Solution</p>
          <h2 className="text-display-lg mt-6 max-w-[18ch] text-white">
            The neutral place both sides of a deal can trust.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-8">
              <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-white/10 text-primary">
                <ShoppingBag className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-6 text-[20px] font-semibold">I'm buying</h3>
              <p className="mt-3 text-white/70">
                Pay a seller you've never met without wiring money on hope. Fund the ZUNO vault,
                track the deal, and only release funds once the item actually arrives.
              </p>
              <Link
                to="/for-buyers"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white underline underline-offset-4 hover:text-primary"
              >
                Get Your ZUNO account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-8">
              <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-white/10 text-primary">
                <Store className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-6 text-[20px] font-semibold">I'm selling</h3>
              <p className="mt-3 text-white/70">
                Send a ZUNO link instead of your bank details. Buyers pay because the money is
                protected — you ship confidently, knowing the payout is already secured.
              </p>
              <Link
                to="/for-sellers"
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white underline underline-offset-4 hover:text-primary"
              >
                Open a seller account <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Phone-frame preview — the vault made visible. Sits in the
   same dark room as the solution cards above it.                */

function ChapterPreview() {
  return (
    <section className="relative overflow-hidden pb-24 text-white lg:pb-32" style={{ background: "oklch(0.16 0.035 265)" }}>
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="mx-auto h-px w-full max-w-[1200px] bg-white/10" />

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="mx-auto w-full max-w-[300px]">
              <div className="relative rounded-[36px] border-4 border-white/15 bg-black/40 p-3 shadow-elevated">
                <div className="rounded-[26px] bg-surface p-5 text-foreground">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>9:41</span>
                    <div className="h-2 w-16 rounded-full bg-muted" />
                  </div>
                  <p className="mt-6 eyebrow text-primary">Escrow #ZUNO8FJ2K</p>
                  <h4 className="mt-2 text-[17px] font-semibold">DJI Mini 4 Pro</h4>
                  <p className="text-sm text-muted-foreground">KES 145,000</p>

                  <div className="mt-6 flex items-center gap-2">
                    {[Wallet, ShieldCheck, PackageCheck].map((Icon, i) => (
                      <div key={i} className="flex flex-1 items-center gap-2">
                        <div
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full border " +
                            (i <= 1 ? "gradient-gold border-transparent text-primary-foreground" : "border-border text-muted-foreground")
                          }
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </div>
                        {i < 2 && <div className={"h-[2px] flex-1 " + (i === 0 ? "bg-primary" : "bg-border")} />}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-[13px] font-semibold text-primary">Funds held safely</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Released to the seller the moment you confirm delivery.
                  </p>

                  <button className="mt-6 w-full rounded-[12px] bg-primary py-3 text-[13px] font-semibold text-primary-foreground shadow-gold">
                    Confirm delivery
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="eyebrow text-primary">See it before you use it</p>
            <h2 className="text-display-lg mt-4 max-w-[16ch] text-white">
              Stop screenshotting proof of payment. Just open a ZUNO vault.
            </h2>
            <p className="mt-5 max-w-[48ch] text-white/70">
              Every deal gets its own escrow record — amount, status, and timeline, visible to both
              sides at once. No more "did you send it yet?" texts.
            </p>
            <Link
              to="/auth/signup"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground shadow-gold transition-transform hover:opacity-95 active:scale-[0.98]"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* CHAPTER 03 — HOW IT WORKS. Three moves, drawn as a flow.       */

function ChapterVault() {
  const steps: { icon: typeof Wallet; title: string; body: string }[] = [
    {
      icon: Wallet,
      title: "Buyer pays into the vault",
      body: "Buyer pays into ZUNO via bank transfer, card, or mobile money. The money lands in a segregated escrow account — not the seller's.",
    },
    {
      icon: ShieldCheck,
      title: "ZUNO holds the funds",
      body: "The seller sees the payment is real and ships. The money sits inside ZUNO and cannot be released until conditions are met.",
    },
    {
      icon: PackageCheck,
      title: "Buyer confirms · seller gets paid",
      body: "The buyer confirms delivery in-app. ZUNO releases the funds to the seller instantly. Done.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <Reveal>
          <ChapterMark n={2} title="How it works" />
          <h2 className="text-display-lg mt-6 max-w-[20ch]">
            Three moves. The money is never in the wrong hands.
          </h2>
          <p className="mt-5 max-w-[56ch] text-body-lg text-muted-foreground">
            ZUNO sits between buyer and seller as the temporary custodian of the funds. Each side
            can see exactly where the money is, at every moment — nothing about it is opaque.
          </p>
        </Reveal>

        <div className="relative mt-16">
          <svg
            aria-hidden
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-10 w-full md:block"
          >
            <path d="M60 20 L 940 20" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 8" />
            <path
              d="M60 20 L 940 20"
              stroke="var(--color-primary)"
              strokeWidth="1.5"
              strokeDasharray="6 14"
              style={{ animation: "zuno-dash 3s linear infinite" }}
              opacity="0.7"
            />
            <circle
              r="4"
              fill="var(--color-primary)"
              style={{ offsetPath: "path('M60 20 L 940 20')", animation: "zuno-particle 6s linear infinite" }}
            />
            <circle
              r="3"
              fill="var(--color-accent)"
              style={{ offsetPath: "path('M60 20 L 940 20')", animation: "zuno-particle 6s linear 2s infinite" }}
            />
          </svg>

          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 80}>
                <div className="relative flex h-full flex-col rounded-[20px] border border-border bg-surface/70 p-6 shadow-card backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "grid h-12 w-12 place-items-center rounded-[14px] border border-border " +
                        (i === 1 ? "gradient-gold text-primary-foreground shadow-gold" : "bg-surface-2 text-primary")
                      }
                    >
                      <s.icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">STEP 0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120}>
          <div className="mt-14">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-90"
            >
              Read the full step-by-step <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Three stacked feature statements — unnumbered, editorial,
   sitting between the mechanism and the proof.                  */

function ChapterFeatures() {
  const features = [
    {
      label: "Visibility",
      title: "Funds visible at every step.",
      body: "Buyer and seller see the same record — amount, status, timestamps. Nobody has to take the other side's word for it.",
    },
    {
      label: "Privacy",
      title: "One link, no bank details shared.",
      body: "Send a ZUNO link instead of your account number. Neither side ever needs the other's banking information to close the deal.",
    },
    {
      label: "Timing",
      title: "Payout only after confirmation.",
      body: "Sellers get paid the moment the buyer confirms — not before, not after a manual chase. The release is instant and automatic.",
    },
  ];

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[900px] px-6 lg:px-8">
        <div className="space-y-16">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="grid gap-3 border-t border-border pt-8 sm:grid-cols-[160px_1fr] sm:gap-10">
                <p className="eyebrow text-primary">{f.label}</p>
                <div>
                  <h3 className="text-heading-lg max-w-[22ch]">{f.title}</h3>
                  <p className="mt-4 max-w-[56ch] text-body-lg text-muted-foreground">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* CHAPTER 04 — THE PROOF. Ledger rows, not cards: mono figures,
   right-aligned, hairline rules — the audit-trail idea made
   literal in the layout itself.                                 */

function LedgerRow({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof ShieldCheck }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 py-5">
      <div className="flex items-center gap-3">
        {Icon ? <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} /> : null}
        <span className="text-[15px] text-foreground">{label}</span>
      </div>
      <span className="shrink-0 font-mono text-[15px] text-muted-foreground">{value}</span>
    </div>
  );
}

function ChapterProof() {
  return (
    <section className="relative bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <ChapterMark n={4} title="The proof" />
            <h2 className="text-display-lg mt-6 max-w-[16ch]">
              We won't ask you to trust the brand. Read the ledger.
            </h2>
            <p className="mt-5 text-muted-foreground">
              ZUNO is pre-launch, so instead of manufacturing testimonials, here's the mechanism
              itself — stated as plainly as we can put it.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              ZUNO operates under Kenyan consumer protection and payment services frameworks and
              is progressing toward CBK Payment Service Provider licensing. Status and licensing
              partner disclosed on request — see{" "}
              <Link to="/security" className="font-semibold text-primary hover:opacity-90">
                Security &amp; compliance
              </Link>
              .
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <LedgerRow icon={ShieldCheck} label="Funds segregated from ZUNO's operating account" value="100%" />
              <LedgerRow icon={ScrollText} label="Timestamped audit trail on every transaction" value="Always on" />
              <LedgerRow icon={RadioTower} label="TLS in transit · encrypted at rest" value="By default" />
              <LedgerRow icon={Scale} label="Disputes reviewed by a human, evidence-first" value="Not automatic" />
              <LedgerRow label="Payment rails at launch — bank, card, mobile money" value="3" />
              <LedgerRow label="Times ZUNO can move escrowed funds without both sides confirming" value="0" />
              <LedgerRow label="Works from a plain link — no app required to start" value="Yes" />
              <LedgerRow label="Target date for the ZUNO MVP launch" value="Dec 2026" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/* CLOSE — Gold gradient room with a waitlist capture, since
   ZUNO is pre-launch, plus the direct "Get Started" path.       */

function ChapterBegin() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      className="relative overflow-hidden py-28 text-center lg:py-36"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 90%, transparent), color-mix(in oklab, var(--color-accent) 70%, black 20%))",
      }}
    >
      <div className="relative mx-auto max-w-[720px] px-6">
        <Reveal>
          <p className="eyebrow text-primary-foreground/80">ZUNO</p>
          <div className="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-[16px] bg-white/15 text-white backdrop-blur-sm">
            <HandCoins className="h-6 w-6" strokeWidth={2} />
          </div>
          <h2 className="text-display-lg mt-6 text-white">Stop taking the leap of faith.</h2>
          <p className="mt-4 text-body-lg text-white/85">
            ZUNO opens to a small group of buyers and sellers first. Join the list to get in early,
            or create your account now.
          </p>

          {submitted ? (
            <p className="mt-8 text-sm font-semibold text-white">
              You're on the list — we'll email you when your spot opens up.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubmitted(true);
              }}
              className="mx-auto mt-8 flex max-w-[420px] flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-12 flex-1 rounded-full border border-white/30 bg-white/10 px-5 text-[15px] text-white placeholder:text-white/60 outline-none focus:border-white/60"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-full bg-white px-6 text-[15px] font-semibold text-foreground transition-transform hover:opacity-90 active:scale-[0.98]"
              >
                Get updates
              </button>
            </form>
          )}

          <div className="mt-6 flex justify-center">
            <Link
              to="/auth/signup"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white hover:bg-white/10"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
