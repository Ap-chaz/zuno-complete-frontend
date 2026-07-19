import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Landmark, FileCheck2 } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & compliance — ZUNO Escrow" },
      {
        name: "description",
        content:
          "How ZUNO handles funds, data and disputes: segregated trust account, TLS, encrypted-at-rest PII, and a written dispute policy.",
      },
      { property: "og:title", content: "Security & compliance — ZUNO Escrow" },
      {
        property: "og:description",
        content: "Fund segregation, encryption, and the answers to the fears real users actually have.",
      },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  const posts = [
    {
      icon: Landmark,
      title: "Fund segregation",
      body: "Buyer funds are held in a client trust account, separate from ZUNO's operating funds. Bank reconciliation runs daily; balances match escrowed transaction sums to the cent.",
    },
    {
      icon: Lock,
      title: "Encryption",
      body: "All connections use TLS 1.2+. PII (payment account details, national IDs where required for KYC, dispute uploads) is encrypted at rest using AES-256. Encryption keys are managed via a dedicated KMS.",
    },
    {
      icon: ShieldCheck,
      title: "Data minimisation",
      body: "We collect the minimum required to move money legally and resolve disputes. We never sell data, run ad-targeting cookies, or share transaction data with third parties beyond regulatory reporting obligations.",
    },
    {
      icon: FileCheck2,
      title: "Regulatory posture",
      body: "ZUNO operates under Kenyan consumer protection and payment services frameworks and is progressing toward CBK Payment Service Provider licensing. Current status and licensing partner disclosed on request.",
    },
    {
      icon: ShieldCheck,
      title: "Seller verification tiers",
      body: "Every seller starts unverified and must pass identity checks before listing: national ID verification, a biometric selfie match against that ID, and — for business sellers — company registration and tax documents. Sellers show as unverified, pending, or verified so buyers know exactly who they're paying.",
    },
  ];

  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40">

        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <p className="eyebrow">Security & compliance</p>
          <h1 className="text-display-lg mt-4 max-w-[22ch]">
            The boring answer to “is my money safe with you?”
          </h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
            ZUNO is a custodian of other people's money. The following isn't marketing — it's how
            the platform is built, and what happens in every failure mode we've thought about.
          </p>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-6 md:grid-cols-2 lg:px-8">
          {posts.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <article className="h-full rounded-[20px] border border-border bg-surface p-8 shadow-card">
                <div className="grid h-11 w-11 place-items-center rounded-[12px] bg-surface-2 text-primary">
                  <p.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h2 className="mt-5 text-heading-md">{p.title}</h2>
                <p className="mt-3 text-muted-foreground">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[820px] px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Straight answers</p>
            <h2 className="text-heading-lg mt-4">Fears we've heard, answered plainly.</h2>
          </Reveal>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>
    </>

  );
}

function Faq() {
  const items = [
    {
      q: "What if the seller never ships?",
      a: "The buyer opens a dispute. Funds stay in the vault. The seller has 48h to provide proof of shipment. Without proof, ZUNO refunds the buyer in full.",
    },
    {
      q: "What if ZUNO shuts down — where's my money?",
      a: "Buyer funds are in a segregated trust account, not on ZUNO's balance sheet. If ZUNO paused operations tomorrow, the trust account is reconciled and released back to the rightful owners.",
    },
    {
      q: "Is my payment account information safe?",
      a: "Yes. Payment account details are stored encrypted at rest and are never displayed publicly. The other party in a deal sees a masked reference, not your raw account details.",
    },
    {
      q: "How long until funds release automatically?",
      a: "By default 72 hours after the seller marks the item as shipped, unless the buyer confirms sooner or opens a dispute. The window is visible on both sides.",
    },
    {
      q: "Who resolves disputes?",
      a: "A ZUNO dispute analyst reviews the evidence uploaded by both sides and applies the published Dispute Policy. Rulings include a written rationale.",
    },
    {
      q: "How are sellers verified?",
      a: "Every seller goes through national ID verification and a biometric selfie match before their listings go live. Business sellers additionally submit company registration details and tax documentation, which move their account into a 'pending' review queue until approved.",
    },
    {
      q: "Where exactly is my money held?",
      a: "In a segregated trust account with a licensed partner bank — not on ZUNO's own balance sheet, and not commingled with ZUNO's operating funds. Every transaction leaves an audit trail.",
    },
  ];
  return (
    <div className="divide-y divide-border rounded-[18px] border border-border bg-surface">
      {items.map((it, i) => (
        <FaqRow key={i} q={it.q} a={it.a} />
      ))}
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (open) {
      setHidden(false);
      return;
    }
    const id = setTimeout(() => setHidden(true), 300);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
      >
        <span className="font-semibold">{q}</span>
        <span
          className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition-transform"
          style={{ transform: open ? "rotate(45deg)" : "none" }}
        >
          <span className="absolute h-[2px] w-3 bg-foreground" />
          <span className="absolute h-3 w-[2px] bg-foreground" />
        </span>
      </button>
      <div
        hidden={hidden}
        className="grid overflow-hidden px-6 transition-[grid-template-rows] duration-300"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p className="pb-5 text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}
