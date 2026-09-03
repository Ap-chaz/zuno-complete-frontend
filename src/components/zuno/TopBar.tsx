import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle, isDashboardRoute } from "@/components/zuno/ThemeToggle";

export { ThemeToggle };

export function TopBar({
  title,
  back,
  right,
}: {
  title?: string;
  back?: string | true;
  right?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Dark/light toggle only ever shows inside the dashboard (/app, /seller,
  // /admin) — TopBar is also used on /auth, /share, /help, which stay light-only.
  const showThemeToggle = isDashboardRoute(pathname);

  return (
    <header className="sticky top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-border/40 bg-background/85 px-4 py-3 backdrop-blur-xl">
      <div className="flex w-10 items-center">
        {back ? (
          <Link
            to={typeof back === "string" ? back : "/app"}
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-foreground transition-colors hover:bg-surface-2"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        ) : null}
      </div>
      <h1 className="truncate text-center text-base font-semibold">{title}</h1>
      <div className="flex items-center justify-end gap-2">
        {right}
        {showThemeToggle ? <ThemeToggle /> : null}
      </div>
    </header>
  );
}
