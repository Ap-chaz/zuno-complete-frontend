import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  Receipt as ReceiptIcon,
} from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { ReceiptSheet } from "@/components/zuno/ReceiptSheet";
import { EmptyState } from "@/components/common/StateViews";
import { currency } from "@/lib/zuno-data";
import type { ReceiptData } from "@/lib/receipt";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/seller/deliveries")({
  head: () => ({ meta: [{ title: "Delivery Management — ZUNO" }] }),
  component: Deliveries,
});

const tabs = ["Waiting", "Active", "Completed"] as const;
type Tab = (typeof tabs)[number];
type Order = {
  item: string;
  buyer: string;
  id: string;
  amount: number;
  address: string;
  placedAt: string;
};

const INITIAL_ORDERS: Record<Tab, Order[]> = {
  Waiting: [
    {
      item: "iPhone 17 Pro Max",
      buyer: "Alvan Mwangi",
      id: "ZUNOAXFVLO4Y8Y",
      amount: 191311,
      address: "Kilimani, Nairobi",
      placedAt: "2026-09-11T09:20:00.000Z",
    },
    {
      item: "AirPods Pro 3",
      buyer: "Brenda Kerubo",
      id: "ZUNO22HJ8K9L0M",
      amount: 32500,
      address: "Westlands, Nairobi",
      placedAt: "2026-09-12T14:05:00.000Z",
    },
  ],
  Active: [
    {
      item: "MacBook Air M4",
      buyer: "James Otieno",
      id: "ZUNO9KLP2M3N4Q",
      amount: 168000,
      address: "Ruaka, Kiambu",
      placedAt: "2026-09-08T11:40:00.000Z",
    },
  ],
  Completed: [
    {
      item: "Sony WH-1000XM6",
      buyer: "Mary Wanjiru",
      id: "ZUNO7HG6FD5SA1",
      amount: 45900,
      address: "Karen, Nairobi",
      placedAt: "2026-08-30T16:15:00.000Z",
    },
    {
      item: "Apple Watch Ultra",
      buyer: "Peter Kim",
      id: "ZUNO5UI6OP7AS8",
      amount: 89000,
      address: "Lavington, Nairobi",
      placedAt: "2026-08-27T10:00:00.000Z",
    },
  ],
};

function Deliveries() {
  const [tab, setTab] = useState<Tab>("Waiting");
  const [orders, setOrders] = useState<Record<Tab, Order[]>>(INITIAL_ORDERS);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const moveOrder = (order: Order, from: Tab, to: Tab, message: string) => {
    setOrders((prev) => ({
      ...prev,
      [from]: prev[from].filter((o) => o.id !== order.id),
      [to]: [order, ...prev[to]],
    }));
    toast.success(message);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Delivery Management" />

      <div className="mx-5 mt-4 grid grid-cols-3 gap-1 rounded-2xl border border-border/40 bg-surface p-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              tab === t ? "bg-gradient-gold text-gold-foreground" : "text-muted-foreground"
            }`}
          >
            {t} <span className="opacity-60">({orders[t].length})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 px-5 pb-8">
        {orders[tab].length === 0 ? (
          <EmptyState
            icon={Package}
            title={`No ${tab.toLowerCase()} orders`}
            description="Orders will appear here as buyers place them."
          />
        ) : (
          <ul className="space-y-3">
            {orders[tab].map((o) => (
              <li key={o.id} className="rounded-3xl border border-border/40 bg-surface p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-muted-foreground">
                    <Package className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{o.item}</p>
                    <p className="truncate text-xs text-muted-foreground">Buyer: {o.buyer}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                      #{o.id}
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Action
                    icon={Phone}
                    label="Call"
                    onClick={() => toast.info("Buyer calling is coming soon.")}
                  />
                  {tab === "Waiting" && (
                    <Action
                      icon={Truck}
                      label="Mark shipped"
                      gold
                      onClick={() =>
                        moveOrder(o, "Waiting", "Active", `${o.item} marked as shipped.`)
                      }
                    />
                  )}
                  {tab === "Active" && (
                    <Action
                      icon={CheckCircle2}
                      label="Delivered"
                      gold
                      onClick={() =>
                        moveOrder(o, "Active", "Completed", `${o.item} marked as delivered.`)
                      }
                    />
                  )}
                  {tab === "Completed" && (
                    <Action
                      icon={ReceiptIcon}
                      label="Receipt"
                      gold
                      onClick={() => setReceiptOrder(o)}
                    />
                  )}
                  <Action icon={Package} label="Details" onClick={() => setDetailsOrder(o)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={detailsOrder !== null} onOpenChange={(open) => !open && setDetailsOrder(null)}>
        <DialogContent>
          {detailsOrder && (
            <>
              <DialogHeader>
                <DialogTitle>{detailsOrder.item}</DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  #{detailsOrder.id}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-2xl border border-border/40 bg-surface-2 p-4">
                  <p className="text-xs text-muted-foreground">Escrow amount</p>
                  <p className="mt-1 text-2xl font-bold">{currency(detailsOrder.amount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Held safely until the buyer confirms delivery — released to you the moment they
                    do.
                  </p>
                </div>
                <Detail icon={Package} label="Buyer" value={detailsOrder.buyer} />
                <Detail icon={MapPin} label="Delivery address" value={detailsOrder.address} />
                <Detail
                  icon={Clock}
                  label="Order placed"
                  value={new Date(detailsOrder.placedAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
                <Detail icon={Truck} label="Status" value={tab} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {receiptOrder && (
        <ReceiptSheet data={buildReceiptData(receiptOrder)} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
}

function buildReceiptData(order: Order): ReceiptData {
  // Flat 1.75% (medium-tier) escrow fee, split evenly, matching the rate
  // shown on the public pricing page — real per-listing fee tiers aren't
  // tracked in this mock data yet.
  const feePct = 0.0175;
  const totalFee = Math.round(order.amount * feePct);
  const sellerFee = Math.round(totalFee / 2);
  const payout = order.amount - sellerFee;
  const dateStr = new Date(order.placedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    id: order.id,
    kind: "payout",
    dateLabel: dateStr,
    rows: [
      { label: "Date", value: dateStr },
      { label: "Buyer", value: order.buyer },
      { label: "Item", value: order.item },
      { label: "Escrow amount", value: currency(order.amount) },
      { label: "ZUNO fee (your share)", value: `-${currency(sellerFee)}` },
    ],
    totalLabel: "Paid out to you",
    totalValue: currency(payout),
  };
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 px-3 py-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Action({
  icon: Icon,
  label,
  gold,
  onClick,
}: {
  icon: typeof Phone;
  label: string;
  gold?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90 ${
        gold
          ? "bg-gradient-gold text-gold-foreground"
          : "border border-border bg-surface-2 text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
