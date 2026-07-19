import type { LucideIcon } from "lucide-react";
import { Inbox, RefreshCw, WifiOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 bg-surface/40 px-6 py-10 text-center"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-[26ch] text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Couldn't load this",
  description = "Something went wrong while fetching data.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
        <WifiOff className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-[28ch] text-xs text-muted-foreground">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
        </button>
      )}
    </div>
  );
}

/** Skeleton rows for card lists (transactions, sellers, notifications). */
export function ListSkeleton({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-surface p-4">
          <Skeleton className="h-11 w-11 shrink-0 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-3xl ${className}`} />;
}

/** "Coming soon" placeholder for interactive elements not yet backed by a real backend. */
export function ComingSoonNotice({ label = "This feature" }: { label?: string }) {
  return (
    <p className="rounded-xl border border-border/50 bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground">
      {label} is coming soon — we're finishing this up.
    </p>
  );
}
