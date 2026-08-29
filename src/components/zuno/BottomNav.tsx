import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Store, LayoutDashboard, Truck, Wallet } from "lucide-react";
import type { ComponentType } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { TranslationKey } from "@/lib/i18n/translations";

type Item = { to: string; labelKey: TranslationKey; icon: ComponentType<{ className?: string }>; matchPrefix?: string };

const buyerItems: Item[] = [
  { to: "/app", labelKey: "nav_home", icon: Home },
  { to: "/app/sellers", labelKey: "nav_sellers", icon: Store },
  { to: "/app/track", labelKey: "nav_tracking", icon: Truck, matchPrefix: "/app/track" },
];

const sellerItems: Item[] = [
  { to: "/seller", labelKey: "nav_overview", icon: LayoutDashboard },
  { to: "/seller/deliveries", labelKey: "nav_orders", icon: Truck },
  { to: "/seller/transactions", labelKey: "nav_payouts", icon: Wallet },
];

export function BottomNav({ variant = "buyer" }: { variant?: "buyer" | "seller" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();
  const items = variant === "seller" ? sellerItems : buyerItems;

  return (
    <nav aria-label={variant === "seller" ? "Seller navigation" : "Main navigation"} className="sticky bottom-0 z-30 mt-auto border-t border-border/60 bg-surface/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <ul className="grid grid-cols-3 gap-1">
        {items.map(({ to, labelKey, icon: Icon, matchPrefix }) => {
          const prefix = matchPrefix || to;
          const active = pathname === to || (to !== "/app" && to !== "/seller" && pathname.startsWith(prefix));
          const exactRoot = (to === "/app" || to === "/seller") && pathname === to;
          const isActive = active || exactRoot;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${isActive ? "bg-gold/15" : ""}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {t(labelKey)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
