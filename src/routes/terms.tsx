import { createFileRoute } from "@tanstack/react-router";

const LAST_UPDATED = "July 15, 2026";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — ZUNO Escrow" },
      { name: "description", content: "The terms under which ZUNO provides escrow services to buyers and sellers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <LegalPage title="Terms of service">
      <h2>1. Acceptance of terms</h2>
      <p>By creating an account or using ZUNO, you agree to these Terms and our Privacy Policy. If you don't agree, please don't use the platform.</p>
      <h2>2. What ZUNO does</h2>
      <p>ZUNO is an escrow service that holds a buyer's payment until they confirm they've received what was agreed, then releases the funds to the seller. ZUNO is a neutral third party — we don't manufacture, ship, or guarantee the quality of goods and services exchanged between buyers and sellers.</p>
      <h2>3. Verification (KYC)</h2>
      <p>Buyers must complete identity verification before sending protected payments. Sellers must complete both identity and business verification before their profile is shown to buyers or before they can accept escrow payments. ZUNO may suspend accounts that fail verification checks or provide false information.</p>
      <h2>4. Fees</h2>
      <p>ZUNO charges a percentage-based fee on completed transactions, shown to both parties before a deal is confirmed. Fees are non-refundable once a transaction is released, except where a dispute is resolved in the buyer's favor.</p>
      <h2>5. Disputes</h2>
      <p>If a buyer and seller disagree about a transaction, either party may open a dispute before funds are released. ZUNO will review evidence from both sides and make a binding decision on fund release. We aim to resolve disputes within a reasonable timeframe, typically under 24–72 hours depending on complexity.</p>
      <h2>6. Prohibited use</h2>
      <p>You may not use ZUNO for illegal goods or services, fraud, money laundering, or to circumvent these Terms (e.g. colluding to falsely release or dispute funds). Violating this may result in immediate account suspension and forfeiture of funds tied to the violation, to the extent permitted by law.</p>
      <h2>7. Liability</h2>
      <p>ZUNO facilitates payment protection but is not liable for the quality, legality, or delivery of goods and services exchanged between users beyond the escrow mechanism itself. Our liability is limited to the funds actually held in escrow for a given transaction.</p>
      <h2>8. Changes to these terms</h2>
      <p>We may update these Terms as ZUNO evolves. Continued use of the platform after a change takes effect means you accept the updated Terms.</p>
      <h2>9. Contact</h2>
      <p>Questions about these Terms can be sent through the Help & Support section in your account settings.</p>
    </LegalPage>
  ),
});

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="prose prose-invert mt-10 max-w-none text-muted-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-foreground [&>h2]:font-display [&>h2]:text-xl [&>p]:leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
}
