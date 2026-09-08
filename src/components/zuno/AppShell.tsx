import type { ReactNode } from "react";

/**
 * Shared shell for the /app (buyer) and /seller sections.
 *
 * This is a genuine "app shell": the outer frame is locked to the viewport
 * height (`h-dvh`) and never scrolls itself — only the page content inside
 * `children` scrolls, in its own internal viewport. That's what makes the
 * sidebar and each page's <TopBar>/<BottomNav> ("position: sticky") actually
 * stay put: sticky positioning only does anything meaningful when its
 * scrolling ancestor is height-bounded. A shell that merely had a
 * `min-height` (its previous form) never gave that ancestor a real, bounded
 * scrollport, so "sticky" elements just scrolled away with the page instead
 * of pinning in place.
 *
 * - Below `lg`: a single column (max 440px, like a phone screen) with a
 *   bottom tab bar, matching the original mobile app.
 * - At `lg` and above: a persistent left sidebar plus content centered in a
 *   comfortably readable column instead of stretched edge-to-edge.
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
    <div className="flex h-dvh min-h-0 flex-col bg-background lg:flex-row">
      <aside className="hidden shrink-0 overflow-y-auto border-r border-border/40 bg-surface/60 lg:block lg:h-full lg:w-64">
        {sidebar}
      </aside>

      <div className="mx-auto flex min-h-0 w-full max-w-[440px] flex-1 flex-col bg-background lg:mx-0 lg:max-w-none">
        <div className="flex min-h-0 flex-1 flex-col lg:mx-auto lg:w-full lg:max-w-3xl lg:px-10 lg:py-8 xl:max-w-5xl xl:px-14 xl:py-10">
          {children}
        </div>
        <div className="lg:hidden">{bottomNav}</div>
      </div>
    </div>
  );
}
