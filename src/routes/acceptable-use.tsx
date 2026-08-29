import { createFileRoute, Link } from "@tanstack/react-router";

const LAST_UPDATED = "August 26, 2026";

export const Route = createFileRoute("/acceptable-use")({
  head: () => ({
    meta: [
      { title: "Acceptable use policy — ZUNO Escrow" },
      { name: "description", content: "Rules for what can and can't be exchanged or done using ZUNO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">Acceptable use policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="mt-10 max-w-none text-muted-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-foreground [&>h2]:font-display [&>h2]:text-xl [&>p]:leading-relaxed [&>p]:mb-5">
          <h2>1. Purpose</h2>
          <p>ZUNO exists to protect real transactions between buyers and sellers. This policy sets out what can't be exchanged or done using the platform, expanding on the prohibited-use section of our <Link to="/terms" className="text-foreground underline underline-offset-2">Terms of service</Link>.</p>
          <h2>2. Prohibited goods and services</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Illegal goods or services under Kenyan law, including counterfeit or stolen items.</li>
            <li>Weapons, ammunition, or explosives.</li>
            <li>Illicit drugs, controlled substances, or drug paraphernalia.</li>
            <li>Wildlife products, protected species, or items violating conservation law.</li>
            <li>Adult content or services involving the exploitation of any person.</li>
            <li>Items or services intended to deceive, defraud, or impersonate a real person or business.</li>
          </ul>
          <h2>3. Prohibited conduct</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Creating fake accounts, or providing false identity or business information during verification.</li>
            <li>Colluding with a counterparty to falsely trigger, delay, or dispute a release of escrow funds.</li>
            <li>Using a payment link or escrow deal for anything other than a genuine transaction (e.g. moving funds between your own accounts to disguise their origin).</li>
            <li>Harassing, threatening, or abusive behavior toward another user, a seller, or ZUNO staff.</li>
            <li>Attempting to circumvent KYC/verification checks or platform fees.</li>
            <li>Scraping, reverse-engineering, or interfering with the normal operation of the platform.</li>
            <li>Sending spam or unsolicited bulk messages to other users through the platform.</li>
          </ul>
          <h2>4. Seller-specific expectations</h2>
          <p>Sellers must accurately describe what they're offering, honor the delivery timelines they agree to, and respond to disputes in good faith. Repeated late deliveries, misrepresented listings, or ignored disputes can affect a seller's trust score and visibility on the platform.</p>
          <h2>5. Reporting a violation</h2>
          <p>If you encounter a listing, message, or user that appears to violate this policy, report it through Help &amp; Support or flag the relevant transaction so our team can review it.</p>
          <h2>6. Enforcement</h2>
          <p>Violating this policy can result in a warning, suspension, or permanent removal from ZUNO, and — where funds are directly tied to the violation — forfeiture of those funds to the extent permitted by law. We may also report illegal activity to the relevant authorities.</p>
          <h2>7. Changes to this policy</h2>
          <p>We may update this policy as new risks emerge. Continued use of ZUNO after a change takes effect means you accept the updated policy.</p>
        </div>
      </div>
    </section>
  ),
});
