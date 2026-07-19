import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Upload, MessageCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { EmptyState, ListSkeleton } from "@/components/common/StateViews";
import { useCreateDispute, useDisputes } from "@/hooks/queries/useDisputes";
import { useActiveTransactions } from "@/hooks/queries/useTransactions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REASONS = [
  { title: "Item not received", desc: "Seller hasn't delivered within agreed time" },
  { title: "Item not as described", desc: "Product differs from listing" },
  { title: "Damaged on arrival", desc: "Item arrived broken or defective" },
  { title: "Other issue", desc: "Tell us what happened" },
];

export const Route = createFileRoute("/app/disputes")({
  head: () => ({ meta: [{ title: "Dispute Center — ZUNO" }] }),
  component: Disputes,
});

function Disputes() {
  const { data: disputes, isLoading } = useDisputes();
  const { data: activeOrders } = useActiveTransactions();
  const [openReason, setOpenReason] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [description, setDescription] = useState("");
  const createDispute = useCreateDispute();

  const resetForm = () => {
    setOpenReason(null);
    setTransactionId("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!transactionId || !description.trim() || !openReason) {
      toast.error("Select the order and describe what happened.");
      return;
    }
    createDispute.mutate(
      { transactionId, reason: openReason, description },
      {
        onSuccess: () => {
          toast.success("Dispute filed. Our team will review it within 24 hours.");
          resetForm();
        },
        onError: () => toast.error("Couldn't file the dispute. Please try again."),
      },
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <TopBar title="Dispute Center" back="/app" />

      <div className="px-5 pt-4 pb-8">
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">We're here to help</p>
              <p className="text-xs text-muted-foreground">Most disputes resolve in under 24 hours.</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">OPEN A DISPUTE</p>
        <div className="mt-3 space-y-3">
          {REASONS.map((r) => (
            <Dialog key={r.title} open={openReason === r.title} onOpenChange={(open) => setOpenReason(open ? r.title : null)}>
              <DialogTrigger asChild>
                <Card icon={FileText} title={r.title} desc={r.desc} />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{r.title}</DialogTitle>
                  <DialogDescription>Select the order and tell us what happened. We'll review it within 24 hours.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Select value={transactionId} onValueChange={setTransactionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an order" />
                    </SelectTrigger>
                    <SelectContent>
                      {(activeOrders ?? []).map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.item} · {t.seller}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened…"
                    rows={4}
                    className="w-full rounded-2xl border border-border/60 bg-input p-3 text-sm outline-none placeholder:text-muted-foreground focus:border-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => toast.info("Photo/video evidence upload is coming soon.")}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Upload className="h-3.5 w-3.5" /> Attach evidence (optional)
                  </button>
                </div>
                <DialogFooter>
                  <button
                    onClick={handleSubmit}
                    disabled={createDispute.isPending}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold disabled:opacity-60"
                  >
                    {createDispute.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Dispute
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <p className="mt-6 text-xs font-bold tracking-[0.18em] text-muted-foreground">ACTIVE DISPUTES</p>
        <div className="mt-3 space-y-3">
          {isLoading && <ListSkeleton rows={1} />}
          {!isLoading && (disputes?.length ?? 0) === 0 && (
            <EmptyState icon={AlertTriangle} title="No active disputes" description="Filed disputes will show up here." />
          )}
          {!isLoading &&
            disputes?.map((d) => (
              <div key={d.id} className="rounded-3xl border border-border/40 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs font-bold">#{d.transactionId}</p>
                  <span className="rounded-full border border-destructive/30 bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                    {d.status === "under_review" ? "In review" : d.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold">{d.reason}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Reported {new Date(d.createdAt).toLocaleDateString("en-GB")} · {d.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toast.info("Additional evidence upload is coming soon.")}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 text-xs font-semibold transition-colors hover:bg-surface"
                  >
                    <Upload className="h-3.5 w-3.5" /> Add evidence
                  </button>
                  <Link to="/help" className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-gold text-xs font-semibold text-gold-foreground">
                    <MessageCircle className="h-3.5 w-3.5" /> Chat support
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }: { icon: typeof FileText; title: string; desc: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border border-border/40 bg-surface p-4 text-left transition-colors hover:border-gold/30">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-2 text-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
