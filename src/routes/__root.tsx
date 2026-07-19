import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 · lost in transit</p>
        <h1 className="text-display-lg mt-4">This page never arrived.</h1>
        <p className="mt-4 text-muted-foreground">
          The link you followed doesn't map to a route on ZUNO. Head back and we'll get you where you were going.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center rounded-[12px] bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Something interrupted the transfer</p>
        <h1 className="text-heading-lg mt-4">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">
          Try again — your session and any escrow funds are unaffected.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex h-11 items-center rounded-[12px] bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center rounded-[12px] border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-[color-mix(in_oklab,var(--color-surface-2)_60%,transparent)]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#fbfaf9" },
      { title: "ZUNO Escrow — Hold the money. Not the risk." },
      {
        name: "description",
        content:
          "Escrow built for the online marketplace economy. ZUNO holds payments in a segregated account until buyer and seller both confirm the deal.",
      },
      { property: "og:title", content: "ZUNO Escrow — Hold the money. Not the risk." },
      {
        property: "og:description",
        content:
          "Pay sellers you've never met — without the leap of faith. ZUNO holds funds until delivery is confirmed.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zuno-website.alvanpeter29.workers.dev/" },
      { property: "og:image", content: "https://zuno-website.alvanpeter29.workers.dev/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "ZUNO — Hold the money. Not the risk." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ZUNO Escrow — Hold the money. Not the risk." },
      {
        name: "twitter:description",
        content:
          "Pay sellers you've never met — without the leap of faith. ZUNO holds funds until delivery is confirmed.",
      },
      { name: "twitter:image", content: "https://zuno-website.alvanpeter29.workers.dev/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('zuno-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFloat />
      </div>
    </QueryClientProvider>
  );
}
