import { useRef, useState } from "react";
import { Camera, CheckCircle2, ImageIcon, Upload } from "lucide-react";

export type DocUploadState = { name: string; sizeKb: number; progress: number; done: boolean } | null;

/**
 * A real file picker (camera or gallery), not a fake "mark as done" toggle.
 * We can't persist the file bytes without a backend, so we track the file's
 * name/size as proof a real document was selected — swap the upload simulation
 * for an actual POST to a storage endpoint once one exists.
 */
export function DocUpload({
  label,
  state,
  setState,
  error,
  hint = "JPG or PNG, up to 10MB",
}: {
  label: string;
  state: DocUploadState;
  setState: (s: DocUploadState) => void;
  error?: string;
  hint?: string;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    const sizeKb = Math.round(f.size / 1024);
    setState({ name: f.name, sizeKb, progress: 0, done: false });
    let p = 0;
    const t = setInterval(() => {
      p += 20;
      if (p >= 100) {
        clearInterval(t);
        setState({ name: f.name, sizeKb, progress: 100, done: true });
      } else {
        setState({ name: f.name, sizeKb, progress: p, done: false });
      }
    }, 120);
  };

  return (
    <div>
      <div
        className={`rounded-2xl border-2 border-dashed p-4 transition-colors ${
          state?.done
            ? "border-success/50 bg-success/5"
            : error
              ? "border-destructive/60 bg-destructive/5"
              : "border-border bg-surface"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-muted-foreground">{label.toUpperCase()}</p>
          {state?.done && <CheckCircle2 className="h-4 w-4 text-success" />}
        </div>
        <p className="mt-1 truncate text-sm font-semibold">
          {state ? `${state.name} · ${state.sizeKb} KB` : "No file selected"}
        </p>
        {state && !state.done && (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-gradient-gold transition-all"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-xs font-semibold"
          >
            <Camera className="h-3.5 w-3.5 text-gold" /> Camera
          </button>
          <button
            type="button"
            onClick={() => galleryRef.current?.click()}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-background text-xs font-semibold"
          >
            <ImageIcon className="h-3.5 w-3.5 text-gold" /> Gallery
          </button>
        </div>
        <input
          ref={cameraRef}
          type="file"
          accept="image/*,.pdf"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {!state && (
          <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Upload className="h-3 w-3" /> {hint}
          </p>
        )}
      </div>
      {error && <p className="mt-1 px-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
