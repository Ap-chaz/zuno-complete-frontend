import { createFileRoute, Link } from "@tanstack/react-router";

const LAST_UPDATED = "August 26, 2026";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping policy — ZUNO Escrow" },
      { name: "description", content: "How delivery timelines and shipping responsibilities work on ZUNO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">Shipping policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="mt-10 max-w-none text-muted-foreground [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:text-foreground [&>h2]:font-display [&>h2]:text-xl [&>p]:leading-relaxed [&>p]:mb-5">
          <h2>1. ZUNO doesn't ship anything</h2>
          <p>ZUNO is an escrow service, not a courier or logistics provider. We hold a buyer's payment; the seller is responsible for getting the item to the buyer however they've agreed — courier, matatu delivery, pickup, or any other method common in their category.</p>
          <h2>2. Delivery timelines</h2>
          <p>Every deal created through ZUNO includes a delivery timeline agreed at the outset (commonly 3, 7, 14, or 30 days). This is the window the seller commits to for getting the item to the buyer. Funds stay locked in escrow throughout, regardless of the shipping method used.</p>
          <h2>3. Proof of shipment</h2>
          <p>Sellers should keep evidence that an item was sent — courier receipts, tracking numbers, dispatch confirmations, or timestamped photos. If a delivery is disputed, proof of shipment is the seller's responsibility to provide; see our <Link to="/dispute-policy" className="text-foreground underline underline-offset-2">Dispute policy</Link>.</p>
          <h2>4. Late or missed deliveries</h2>
          <p>If the agreed delivery window passes without the item arriving, the buyer can open a dispute directly from the transaction. Escrow stays frozen while the case is reviewed, so a buyer is never left having paid for something that never showed up.</p>
          <h2>5. Shipping costs</h2>
          <p>Shipping costs are between buyer and seller and aren't collected or processed by ZUNO. Whether shipping is included in the escrow amount or paid separately should be agreed and noted before the deal is funded.</p>
          <h2>6. Confirming receipt</h2>
          <p>Once an item arrives, the buyer should inspect it and confirm delivery in the app to release funds to the seller. Don't confirm delivery until you've actually received and checked the item — confirming early removes ZUNO's ability to help if something turns out to be wrong.</p>
          <h2>7. International or cross-border delivery</h2>
          <p>ZUNO is built around deals within Kenya. Cross-border shipping introduces customs, duties, and timelines outside our visibility, so buyers and sellers taking on such a deal should build extra time into the agreed delivery window and document the shipment closely.</p>
        </div>
      </div>
    </section>
  ),
});
