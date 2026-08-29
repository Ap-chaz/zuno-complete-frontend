import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Shield, QrCode, ArrowUpRight, ShieldCheck, Package, FilePlus, Inbox } from "lucide-react";
import { Logo } from "@/components/zuno/Logo";
import { EmptyState, ListSkeleton } from "@/components/common/StateViews";
import { useActiveTransactions, useTransactions } from "@/hooks/queries/useTransactions";
import { useUnreadNotificationCount } from "@/hooks/queries/useNotifications";
import { formatCurrency, statusColorClass } from "@/services/transactions.service";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import type { Transaction, TxStatus } from "@/types/models";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Home — ZUNO" }] }),
  component: Home,
});

const PROGRESS_BY_STATUS: Record<TxStatus, { pct: string; label: string }> = {
  Pending: { pct: "25%", label: "Awaiting funding" },
  Funded: { pct: "50%", label: "Funds secured" },
  Protected: { pct: "75%", label: "In transit" },
  Disputed: { pct: "60%", label: "Under review" },
  Completed: { pct: "100%", label: "Delivered" },
  Refunded: { pct: "0%", label: "Refunded" },
};

function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { data: activeOrders, isLoading: loadingActive } = useActiveTransactions();
  const { data: transactions, isLoading: loadingRecent } = useTransactions();
  const { data: unreadCount } = useUnreadNotificationCount();
  const recent = (transactions ?? []).slice(0, 3);
  const protectedTotal = (activeOrders ?? []).reduce((sum, t) => sum + t.amount, 0);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex-1 overflow-y-auto pb-6">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6">
        <Logo />
        <div className="flex items-center gap-2">
          <Link
            to="/app/notifications"
            className="relative grid h-10 w-10 place-items-center rounded-xl bg-surface"
            aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          >
            <Bell className="h-5 w-5 text-gold" />
            {Boolean(unreadCount) && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                {unreadCount && unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <Link
            to="/app/account"
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-sm font-bold text-gold-foreground"
            aria-label="Account"
          >
            {user?.avatarInitial ?? firstName.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      <p className="mt-5 px-5 text-sm text-muted-foreground">{t("home_greeting")}, {firstName} 👋</p>

      {/* Balance card */}
      <section className="mx-5 mt-3 overflow-hidden rounded-3xl border border-border/40 bg-gradient-card p-6 shadow-card">
        <div className="relative">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/15 blur-3xl" />
          <div className="absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-accent/25 blur-3xl" />

          <div className="relative flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-gold" /> {t("home_protected_in_escrow").toUpperCase()}
          </div>
          <p className="relative mt-3 text-4xl font-bold tracking-tight">{formatCurrency(protectedTotal)}</p>

          <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
            <Stat label={t("home_trust_score")} value={`${user?.trustScore ?? 0} / 1000`} />
            <Stat label={t("home_active")} value={`${activeOrders?.length ?? 0} deals`} />
            <Stat label={t("home_completed")} value={`${(transactions ?? []).filter((tx) => tx.status === "Completed").length}`} />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-6 grid grid-cols-3 gap-3 px-5">
        <Action to="/app/new-escrow" icon={FilePlus} label="New" />
        <Action to="/app/scan" icon={QrCode} label="Scan QR" />
        <Action to="/app/safepay" icon={ShieldCheck} label="SafePay" />
      </section>

      {/* Active Orders */}
      <section className="mt-7 px-5">
        <SectionHeader title={t("home_active_orders")} to="/app/track" seeAllLabel={t("home_see_all")} />
        {loadingActive ? (
          <ListSkeleton rows={2} className="mt-3" />
        ) : (activeOrders?.length ?? 0) === 0 ? (
          <div className="mt-3">
            <EmptyState icon={Package} title="No active orders" description="Start a new escrow deal to see it here." />
          </div>
        ) : (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {activeOrders!.map((order) => (
              <ActiveOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Recent transactions */}
      <section className="mt-7 px-5">
        <SectionHeader title={t("home_recent_transactions")} to="/app/transactions" seeAllLabel={t("home_see_all")} />
        {loadingRecent ? (
          <ListSkeleton rows={3} className="mt-3" />
        ) : recent.length === 0 ? (
          <div className="mt-3">
            <EmptyState icon={Inbox} title="No transactions yet" description="Your escrow payments will appear here." />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border/40 rounded-3xl border border-border/40 bg-surface">
            {recent.map((t) => (
              <li key={t.id}>
                <Link to="/app/transaction/$id" params={{ id: t.id }} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-lg">📱</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.item}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.seller} · {t.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatCurrency(t.amount)}</p>
                    <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColorClass(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ActiveOrderCard({ order }: { order: Transaction }) {
  const progress = PROGRESS_BY_STATUS[order.status];
  return (
    <Link
      to="/app/transaction/$id"
      params={{ id: order.id }}
      className="min-w-[260px] flex-1 rounded-3xl border border-border/40 bg-surface p-4 shadow-card transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-2 text-lg">
            <Package className="h-5 w-5 text-gold" />
          </span>
          <div>
            <p className="text-sm font-semibold">{order.item}</p>
            <p className="text-xs text-muted-foreground">{order.seller}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusColorClass(order.status)}`}>{order.status}</span>
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold">{formatCurrency(order.amount)}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gold" style={{ width: progress.pct }} />
          </div>
          <span className="text-[10px] text-muted-foreground">{progress.label}</span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}

function Action({ to, icon: Icon, label }: { to: string; icon: typeof FilePlus; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-border/40 bg-surface text-gold transition-colors hover:bg-surface-2">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </Link>
  );
}

function SectionHeader({ title, to, params, seeAllLabel = "See all" }: { title: string; to: string; params?: Record<string, string>; seeAllLabel?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold">{title}</h2>
      <Link to={to} params={params} className="flex items-center gap-1 text-xs font-medium text-gold">
        {seeAllLabel} <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
