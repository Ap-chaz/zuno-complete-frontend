import { useEffect, useState } from "react";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import {
  downloadReceipt,
  shareReceipt,
  getReceiptImageDataUrl,
  type ReceiptData,
} from "@/lib/receipt";

/**
 * Full-screen receipt preview. Opened when the user taps the "Receipt"
 * button on the transaction / payout screen. Share and Download live inside
 * this view, next to the receipt itself — not on the page that opens it.
 */
export function ReceiptSheet({ data, onClose }: { data: ReceiptData; onClose: () => void }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState<"download" | "share" | null>(null);

  useEffect(() => {
    let active = true;
    getReceiptImageDataUrl(data).then((url) => {
      if (active) setImgUrl(url);
    });
    return () => {
      active = false;
    };
  }, [data]);

  const handleDownload = async () => {
    if (isBusy) return;
    setIsBusy("download");
    await downloadReceipt(data);
    setIsBusy(null);
  };

  const handleShare = async () => {
    if (isBusy) return;
    setIsBusy("share");
    await shareReceipt(data);
    setIsBusy(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-border/40 bg-background/85 px-4 py-3 backdrop-blur-xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-foreground transition-colors hover:bg-surface-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-center text-base font-semibold">Receipt</h1>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleShare}
            disabled={isBusy !== null}
            aria-label="Share receipt"
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isBusy !== null}
            aria-label="Download receipt"
            className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-foreground transition-colors hover:bg-surface-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-surface">
        {imgUrl ? (
          <img src={imgUrl} alt={`Receipt #${data.id}`} className="mx-auto block w-full max-w-sm" />
        ) : (
          <div className="mx-auto flex h-[60vh] w-full max-w-sm items-center justify-center">
            <p className="text-sm text-muted-foreground">Preparing receipt…</p>
          </div>
        )}
      </div>

      {imgUrl && (
        <div className="border-t border-border/40 bg-background/95 px-5 py-4 backdrop-blur-xl">
          <button
            onClick={handleDownload}
            disabled={isBusy !== null}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            <Download className="h-4 w-4" /> {isBusy === "download" ? "Preparing…" : "Download PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
