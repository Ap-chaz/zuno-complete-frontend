import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/zuno/Logo";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/share/1962FHVpz7/", Icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/zuno.ke?igsh=MWo0dTN6ZzJnamIyZA==", Icon: InstagramIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@zuno.ke?_r=1&_t=ZS-97hFXRtdJbx", Icon: TikTokIcon },
  { label: "X", href: "https://x.com/EscrowZuno", Icon: XIcon },
] as const;

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 21v-7.9h2.65l.4-3.08H13.5V8.04c0-.89.25-1.5 1.52-1.5h1.63V3.79A21.8 21.8 0 0 0 14.3 3.6c-2.24 0-3.78 1.37-3.78 3.87v2.55H8v3.08h2.52V21h2.98Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.15-1.4V14.9a5.32 5.32 0 1 1-4.55-5.27v2.36a2.98 2.98 0 1 0 2.1 2.85V2.5h2.31a4.28 4.28 0 0 0 3.29 3.32v1.99Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.6 10.62 20.1 3h-1.55l-5.64 6.62L8.4 3H3.2l6.82 9.72L3.2 21h1.55l5.96-7L15.6 21h5.2l-7.2-10.38Zm-2.1 2.47-.69-.97L5.06 4.1h2.38l4.43 6.2.69.97 5.76 8.07h-2.38l-4.94-6.92Z" />
    </svg>
  );
}

const columns = [
  {
    title: "Product",
    links: [
      { to: "/how-it-works", label: "How it works" },
      { to: "/pricing", label: "Pricing" },
      { to: "/for-buyers", label: "For buyers" },
      { to: "/for-sellers", label: "For sellers" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/security", label: "Security & compliance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/terms", label: "Terms of service" },
      { to: "/privacy", label: "Privacy" },
      { to: "/dispute-policy", label: "Dispute policy" },
    ],
  },
] as const;

const contactLinks = [
  { label: "escrowzuno@gmail.com", href: "mailto:escrowzuno@gmail.com" },
  { label: "WhatsApp: +254 714 637 437", href: "https://wa.me/254714637437" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-border/60">
      <div className="mx-auto max-w-[1200px] px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center">
              <Logo size={32} />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A neutral third party that holds funds between online buyers and sellers
              until both sides confirm the deal is done.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">
              ZUNO holds buyer funds in accounts segregated from company operating accounts.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`ZUNO on ${label}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow mb-4">Contact us</p>
            <ul className="space-y-3">
              {contactLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} ZUNO Escrow. All rights reserved.</p>
          <p className="font-mono tracking-wide">Global escrow, built for online marketplaces</p>
        </div>
      </div>
    </footer>
  );
}
