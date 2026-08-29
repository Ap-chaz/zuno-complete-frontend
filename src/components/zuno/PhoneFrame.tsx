import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[440px] flex-col bg-background sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl" style={{ minHeight: "100dvh" }}>
      {children}
    </div>
  );
}

export function StatusBar({ title }: { title?: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-4 pb-2 text-xs font-medium text-muted-foreground">
      <span>9:41</span>
      {title && <span className="font-semibold text-foreground">{title}</span>}
      <div className="flex items-center gap-1">
        <span>●●●●</span>
      </div>
    </div>
  );
}
