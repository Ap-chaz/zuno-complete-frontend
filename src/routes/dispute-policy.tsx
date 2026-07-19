import { createFileRoute } from "@tanstack/react-router";

const LAST_UPDATED = "July 15, 2026";

export const Route = createFileRoute("/dispute-policy")({
  head: () => ({
    meta: [
      { title: "Dispute policy — ZUNO Escrow" },
      { name: "description", content: "How ZUNO handles disagreements between buyers and sellers on the platform." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <section className="pt-32 pb-24 lg:pt-40">
      <div className="mx-auto max-w-[720px] px-6 lg:px-8">
        <p className="eyebrow">Legal</p>
        <h1 className="text-display-lg mt-3">Dispute policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        <div className="mt-10 space-y-5 text-muted-foreground">
          <p>Either party in a ZUNO deal may open a dispute before funds are released. When a dispute is opened, the vault is frozen.</p>
          <p>Both parties are notified and invited to upload evidence: proof of shipment, delivery photos, chat logs, product photos, and any correspondence.</p>
          <p>A ZUNO dispute analyst reviews the evidence and issues a written ruling within 24 business hours, applying the following principles:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Proof of shipment is the seller's responsibility.</li>
            <li>Proof of non-delivery or item defect is the buyer's responsibility.</li>
            <li>Where neither side can substantiate their claim, ZUNO refunds the buyer in full.</li>
          </ul>
          <p>Rulings are binding on release of the escrow funds. Either party may seek further legal recourse independently.</p>
        </div>
      </div>
    </section>
  ),
});
