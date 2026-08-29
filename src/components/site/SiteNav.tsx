import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/zuno/ThemeToggle";
import { Logo } from "@/components/zuno/Logo";

const links = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/security", label: "Security" },
  { to: "/pricing", label: "Pricing" },
  { to: "/for-buyers", label: "For buyers" },
  { to: "/for-sellers", label: "For sellers" },
  { to: "/about", label: "About" },
] as const;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus trap: keep Tab/Shift+Tab cycling within the drawer while it's open,
  // and return focus to the toggle button when it closes.
  useEffect(() => {
    if (!open) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null,
      );

    const focusable = getFocusable();
    (focusable[0] ?? drawer).focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !drawer.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !drawer.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 lg:top-5 lg:px-6">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex h-14 max-w-[1080px] items-center justify-between rounded-full px-3 shadow-card lg:h-16 lg:px-4"
      >
        <Link to="/" className="flex items-center pl-2">
          <Logo size={26} />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors " +
                  (active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            to="/auth/signup"
            className="inline-flex h-10 items-center rounded-full bg-primary pl-4 pr-3 text-sm font-semibold text-primary-foreground transition-transform hover:opacity-95 active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-1 pr-1 lg:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border/70 text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-surface p-6 shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-[10px] border border-border/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex flex-col">
              {links.map((l, i) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="border-b border-border/50 py-4 text-lg font-medium text-foreground"
                  style={{ animation: `zuno-rise 320ms var(--ease-emphasis) ${i * 40}ms both` }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <Link
              to="/auth/signup"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-primary px-4 text-base font-semibold text-primary-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
