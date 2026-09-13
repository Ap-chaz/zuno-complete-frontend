import { createFileRoute } from "@tanstack/react-router";
import { Disputes } from "./app.disputes";

export const Route = createFileRoute("/seller/disputes")({
  head: () => ({ meta: [{ title: "Dispute Center — ZUNO Seller" }] }),
  component: SellerDisputes,
});

// Seller's own open orders — kept in sync with the mock data in
// seller.deliveries.tsx (Waiting + Active tabs are the ones a seller could
// plausibly need to raise a dispute against).
const SELLER_ORDER_OPTIONS = [
  { id: "ZUNOAXFVLO4Y8Y", label: "iPhone 17 Pro Max · Alvan Mwangi" },
  { id: "ZUNO22HJ8K9L0M", label: "AirPods Pro 3 · Brenda Kerubo" },
  { id: "ZUNO9KLP2M3N4Q", label: "MacBook Air M4 · James Otieno" },
];

const SELLER_REASONS = [
  { title: "Buyer won't confirm delivery", desc: "Item was delivered but the buyer hasn't confirmed, holding up your payout" },
  { title: "Buyer disputes a delivered item", desc: "You have proof of delivery, but the buyer claims otherwise" },
  { title: "Unfair return or refund request", desc: "A buyer is requesting a return or refund you don't believe is valid" },
  { title: "Other issue", desc: "Tell us what happened" },
];

function SellerDisputes() {
  return (
    <Disputes
      backTo="/seller"
      helpTo="/seller/help"
      orderOptions={SELLER_ORDER_OPTIONS}
      emptyOrdersLabel="No open orders to report"
      reasons={SELLER_REASONS}
    />
  );
}
