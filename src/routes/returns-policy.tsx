import { createFileRoute, Link } from "@tanstack/react-router";

const LAST_UPDATED = "August 26, 2026";

export const Route = createFileRoute("/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns policy — ZUNO Escrow" },
      { name: "description", content: "How returns and exchanges are handled between buyers and sellers on ZUNO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">Returns policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="mt-10 max-w-none text-muted-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-foreground [&>h2]:font-display [&>h2]:text-xl [&>p]:leading-relaxed [&>p]:mb-5">
          <h2>1. ZUNO's role in a return</h2>
          <p>ZUNO is an escrow service, not the seller of any item passing through the platform. We don't take physical possession of goods, so a return itself — sending an item back — happens directly between buyer and seller. What ZUNO controls is the money: we keep it held in escrow until the return is resolved, so a buyer isn't left paying for an item they've sent back.</p>
          <h2>2. Before confirming delivery</h2>
          <p>The best time to catch a problem is before you confirm delivery. Once a buyer confirms, funds release to the seller and a return becomes a negotiation between the two parties rather than an escrow-protected one. Inspect an item against its listed description before confirming.</p>
          <h2>3. Requesting a return after receiving an item</h2>
          <p>If you've received an item and it doesn't match what was agreed — wrong item, damaged, materially different from the listing — don't confirm delivery. Instead, open a dispute from the transaction. This freezes the funds while the return is worked out, whether that's a replacement, a partial refund, or a full refund.</p>
          <h2>4. Who pays for return shipping</h2>
          <p>Return shipping costs are agreed between buyer and seller, ideally noted at the time the deal is created. Where there's no prior agreement and a dispute is opened, our dispute analysts take return-shipping responsibility into account when deciding how funds are released — generally, a seller who shipped the wrong or defective item bears the cost of getting it back.</p>
          <h2>5. Condition of returned items</h2>
          <p>Sellers can reasonably expect a returned item back in the condition it was received, barring the defect being disputed. Evidence of an item's condition (photos, videos) submitted during a dispute is used by our analysts to reach a fair outcome — see our <Link to="/dispute-policy" className="text-foreground underline underline-offset-2">Dispute policy</Link>.</p>
          <h2>6. Services and non-returnable items</h2>
          <p>Some transactions — completed services, custom or made-to-order items, digital goods — aren't practically "returnable" in the physical sense. For these, a dispute focuses on whether what was delivered matches what was agreed, rather than on shipping an item back.</p>
          <h2>7. How to start a return</h2>
          <p>Contact the seller directly first where possible. If you can't reach an agreement, open a dispute from the transaction in your Activity tab, or reach out through Help &amp; Support.</p>
        </div>
      </div>
    </section>
  ),
});
