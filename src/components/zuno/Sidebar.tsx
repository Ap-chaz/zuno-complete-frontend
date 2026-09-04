import { Link, useRouterState } from "@tanstack/react-router";
import { buyerNavItems, sellerNavItems } from "@/components/zuno/BottomNav";
import { Logo } from "@/components/zuno/Logo";
import { useLanguage } from "@/hooks/useLanguage";

/** Persistent left-hand navigation shown on desktop (lg+) instead of the mobile bottom tab bar. */
export function Sidebar({ variant = "buyer" }: { variant?: "buyer" | "seller" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();
  const items = variant === "seller" ? sellerNavItems : buyerNavItems;
  const root = variant === "seller" ? "/seller" : "/app";

  return (
    <div className="flex h-full flex-col px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <Logo />
        {variant === "seller" && (
          <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">SELLER</span>
        )}
      </div>

      <nav aria-label={variant === "seller" ? "Seller navigation" : "Main navigation"} className="mt-8 flex flex-col gap-1">
        {items.map(({ to, labelKey, icon: Icon, matchPrefix }) => {
          const prefix = matchPrefix || to;
          const isActive = pathname === to || (to !== root && pathname.startsWith(prefix));
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-gold/15 text-gold" : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 text-[11px] text-muted-foreground/70">
        {variant === "seller" ? "Seller dashboard" : "Buyer dashboard"}
      </div>
    </div>
  );
}
