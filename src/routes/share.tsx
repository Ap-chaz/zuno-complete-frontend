import { createFileRoute } from "@tanstack/react-router";
import { Share2, Copy, Gift, Users, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/zuno/TopBar";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/share")({
  head: () => ({ meta: [{ title: "Invite friends — ZUNO" }] }),
  component: Share,
});

function Share() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const code = `${(user?.name?.split(" ")[0] ?? "ZUNO").toUpperCase()}250`;
  const shareText = `Join me on ZUNO and get KES 250 off your first protected deal — use code ${code}.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Referral code copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy — select and copy manually.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "ZUNO", text: shareText });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Invite message copied — paste it anywhere.");
    } catch {
      toast.error("Couldn't share. Try copying your code instead.");
    }
  };

  return (
    <PhoneFrame>
      <TopBar title="Invite & Earn" back="/app/account" />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <div className="overflow-hidden rounded-3xl border border-gold/30 bg-gradient-card p-6 text-center shadow-elevated">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-gold text-gold-foreground">
            <Gift className="h-9 w-9" />
          </div>
          <p className="mt-4 text-xs font-bold tracking-[0.18em] text-muted-foreground">REFERRAL REWARDS</p>
          <p className="mt-2 text-3xl font-bold">Give KES 250, get KES 250</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your friend joins ZUNO. You both earn on their first protected deal.
          </p>
        </div>

        <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">YOUR CODE</p>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-4">
          <span className="font-mono text-2xl font-bold tracking-widest text-gold">{code}</span>
          <button
            onClick={handleCopy}
            aria-label="Copy referral code"
            className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold transition-opacity hover:opacity-80"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <button
          onClick={handleShare}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-base font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95"
        >
          <Share2 className="h-5 w-5" /> Share ZUNO
        </button>

        <p className="mt-6 px-1 text-xs font-bold tracking-[0.18em] text-muted-foreground">YOUR INVITES</p>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          <Box v="12" l="Invited" />
          <Box v="7" l="Joined" />
          <Box v="KES 1,750" l="Earned" />
        </div>

        <ul className="mt-4 space-y-2">
          {["Brenda K. · joined", "James O. · earned KES 250", "Mary W. · joined", "Peter K. · pending"].map((t, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-surface p-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-surface-2 text-gold"><Users className="h-4 w-4" /></span>
              <p className="flex-1 text-sm">{t}</p>
            </li>
          ))}
        </ul>
      </div>
    </PhoneFrame>
  );
}

function Box({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-surface p-3">
      <p className="text-base font-bold">{v}</p>
      <p className="text-[10px] text-muted-foreground">{l}</p>
    </div>
  );
}
