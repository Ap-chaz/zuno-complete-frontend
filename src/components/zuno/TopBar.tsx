import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/zuno/ThemeToggle";

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
      <div className="flex w-10 items-center justify-end">{right}</div>
    </header>
  );
}
