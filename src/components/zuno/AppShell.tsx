import type { ReactNode } from "react";

/**
 * Shared shell for the /app (buyer) and /seller sections.
 *
 * - Below `lg`: unchanged mobile experience — a single centered column
 *   (max 440px, like a phone screen) with a bottom tab bar.
 * - At `lg` and above: a desktop app layout — a persistent left sidebar
 *   for navigation, and page content centered in a comfortably readable
 *   column instead of being stretched edge-to-edge across the screen.
 */
export function AppShell({
  children,
  sidebar,
  bottomNav,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  bottomNav: ReactNode;
}) {
  return (
    <div className="bg-background lg:flex lg:min-h-dvh">
      <aside className="hidden shrink-0 border-r border-border/40 bg-surface/60 lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-64 lg:overflow-y-auto">
        {sidebar}
      </aside>

      <div
        className="mx-auto flex w-full max-w-[440px] flex-col bg-background lg:mx-0 lg:max-w-none lg:flex-1"
        style={{ minHeight: "100dvh" }}
      >
        <div className="flex flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-3xl lg:px-10 lg:py-8 xl:max-w-5xl xl:px-14 xl:py-10">
          {children}
        </div>
        <div className="lg:hidden">{bottomNav}</div>
      </div>
    </div>
  );
}
