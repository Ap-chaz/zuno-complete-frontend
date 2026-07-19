import { createFileRoute } from "@tanstack/react-router";

const LAST_UPDATED = "July 15, 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — ZUNO Escrow" },
      { name: "description", content: "How ZUNO collects, stores and handles your personal information." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">Privacy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="mt-10 max-w-none text-muted-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-foreground [&>h2]:font-display [&>h2]:text-xl [&>p]:leading-relaxed [&>p]:mb-5">
          <h2>1. What we collect</h2>
          <p>To provide escrow protection, ZUNO collects: your name, phone number, and email; identity verification documents (ID, selfie); for sellers, business details (category, registration number, KRA PIN, payout account); and transaction records (amounts, counterparties, timestamps, and any dispute evidence you submit).</p>
          <h2>2. Why we collect it</h2>
          <p>We use this data to verify who you are, protect both sides of a transaction, process payouts, resolve disputes fairly, and meet our legal obligations under Kenyan financial regulations.</p>
          <h2>3. Who we share it with</h2>
          <p>We share the minimum necessary data with: payment processors (M-Pesa, banks) to move funds; identity verification providers to confirm documents are genuine; and regulators or law enforcement where legally required. We do not sell your personal data to advertisers.</p>
          <h2>4. Data retention</h2>
          <p>We keep transaction and verification records for as long as your account is active, and for a period afterward as required by financial recordkeeping regulations. You can request deletion of non-essential personal data at any time.</p>
          <h2>5. Your rights</h2>
          <p>You can request a copy of the personal data we hold about you, ask us to correct inaccurate details, or request account deletion, subject to the retention requirements above (e.g. we may need to keep records of a completed transaction even after a deletion request).</p>
          <h2>6. Security</h2>
          <p>Identity documents and payout details are encrypted in transit and at rest. Access to verification data is limited to the systems and staff that need it to review submissions or resolve disputes.</p>
          <h2>7. Changes to this policy</h2>
          <p>If we materially change how we collect or use your data, we'll notify you in-app before the change takes effect.</p>
          <h2>8. Contact</h2>
          <p>Questions about this policy can be sent through the Help & Support section in your account settings.</p>
        </div>
      </div>
    </section>
  ),
});
