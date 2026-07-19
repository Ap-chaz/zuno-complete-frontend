import { Wallet, ShieldCheck, PackageCheck } from "lucide-react";

/**
 * Buyer → ZUNO Escrow → Seller, drawn as a technical network diagram
 * with a continuous ambient particle traveling the path.
 */
export function EscrowFlowDiagram() {
  const steps: { icon: typeof Wallet; image?: string; title: string; body: string }[] = [
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
    <div className="relative">
      {/* connecting SVG spans the row on desktop */}
      <svg
        aria-hidden
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 right-0 top-8 hidden h-10 w-full md:block"
      >
        <path
          d="M60 20 L 940 20"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
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
          style={{
            offsetPath: "path('M60 20 L 940 20')",
            animation: "zuno-particle 6s linear infinite",
          }}
        />
        <circle
          r="3"
          fill="var(--color-accent)"
          style={{
            offsetPath: "path('M60 20 L 940 20')",
            animation: "zuno-particle 6s linear 2s infinite",
          }}
        />
      </svg>

      <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={
              "relative flex flex-col rounded-[20px] border border-border bg-surface/70 shadow-card backdrop-blur-sm " +
              (s.image ? "overflow-hidden" : "p-6")
            }
          >
            {s.image && (
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                decoding="async"
                className="h-40 w-full object-cover sm:h-44"
              />
            )}
            <div className={s.image ? "p-6" : ""}>
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
          </li>
        ))}
      </ol>
    </div>
  );
}
