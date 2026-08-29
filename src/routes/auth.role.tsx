import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Store, ShieldCheck, ChevronRight } from "lucide-react";
import { TopBar } from "@/components/zuno/TopBar";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { setRole, type ZunoRole } from "@/lib/zuno-role";

export const Route = createFileRoute("/auth/role")({
  head: () => ({ meta: [{ title: "Choose your role — ZUNO" }] }),
  component: RolePicker,
});

function RolePicker() {
  const navigate = useNavigate();

  const choose = (role: ZunoRole) => {
    setRole(role);
    navigate({ to: "/auth/verify" });
  };

  return (
    <PhoneFrame>
      <TopBar title="Choose Account" back="/auth/signup" />
      <div
        className="flex flex-1 flex-col justify-between px-6"
        style={{ paddingTop: "clamp(16px, 3vh, 24px)", paddingBottom: "clamp(16px, 3vh, 24px)", gap: "clamp(16px, 3vh, 24px)" }}
      >
        <div style={{ gap: "clamp(12px, 2vh, 20px)" }} className="flex flex-col">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-accent">ONE MORE STEP</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight">How will you use ZUNO?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick the experience that matches you. You can't switch later without contacting support.
            </p>
          </div>

          <div className="space-y-3">
            <RoleCard
              icon={ShoppingBag}
              title="I'm a Buyer"
              sub="Send funds securely & track deliveries with escrow protection."
              onClick={() => choose("buyer")}
            />
            <RoleCard
              icon={Store}
              title="I'm a Seller"
              sub="Receive payments, manage orders & grow your verified business."
              onClick={() => choose("seller")}
            />
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-border/40 bg-surface/60 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <span>Your role is stored to your account and determines which dashboard opens after login.</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

function RoleCard({
  icon: Icon,
  title,
  sub,
  onClick,
}: {
  icon: typeof ShoppingBag;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-3xl border border-border/60 bg-surface p-4 text-left transition-colors hover:border-gold/60"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-gold text-gold-foreground shadow-gold">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{sub}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
    </button>
  );
}
