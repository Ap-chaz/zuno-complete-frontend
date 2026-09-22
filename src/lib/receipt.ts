import { jsPDF } from "jspdf";
import { toast } from "sonner";
import zunoLogo from "@/assets/zuno-logo-new.png";

/**
 * Shared receipt builder used by both the buyer receipt (app.transaction.$id)
 * and the seller payout receipt (seller.deliveries). Renders a single receipt
 * design onto an offscreen canvas, then exports it as a real PDF file via
 * jsPDF — so "Download" always produces an actual downloaded file, never the
 * browser print dialog, and looks the same on every screen size.
 */

export interface ReceiptRow {
  label: string;
  value: string;
}

export interface ReceiptData {
  id: string;
  kind: "payment" | "payout";
  dateLabel: string;
  greetingName?: string;
  rows: ReceiptRow[];
  totalLabel: string;
  totalValue: string;
  note?: string;
}

const GOLD_1 = "#ecbb63";
const GOLD_2 = "#cf8a3c";
const INK = "#141a29";
const INK_SOFT = "#1c2438";
const MUTED = "#6b7280";
const LIGHT_MUTED = "#9aa1af";
const BORDER = "#eef0f3";
const BADGE_BG = "#fbeed9";
const BADGE_TEXT = "#8a5a1f";
const ACCENT = "#5b3fc4";
const BANNER_INK = "#241a08";

const SCALE = 2;
const CARD_W = 360 * SCALE;
const PAD = 28 * SCALE;
const BANNER_H = 116 * SCALE;
const RADIUS = 24 * SCALE;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawShield(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
) {
  const w = size;
  const h = size * 1.1;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.bezierCurveTo(w / 2, 0, w, h * 0.14, w, h * 0.14);
  ctx.lineTo(w, h * 0.5);
  ctx.bezierCurveTo(w, h * 0.86, w * 0.7, h, w / 2, h);
  ctx.bezierCurveTo(w * 0.3, h, 0, h * 0.86, 0, h * 0.5);
  ctx.lineTo(0, h * 0.14);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Small deterministic PRNG (mulberry32) seeded from the receipt id, so the
 * decorative barcode is stable across re-renders of the same receipt. */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h + 0x6d2b79f5) >>> 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FONT = "'Plus Jakarta Sans', 'Segoe UI', -apple-system, sans-serif";

function measure(ctx: CanvasRenderingContext2D, data: ReceiptData) {
  ctx.font = `600 ${15 * SCALE}px ${FONT}`;
  const noteLines = data.note ? wrapText(ctx, data.note, CARD_W - PAD * 2) : [];

  const greetingH = data.greetingName ? 64 * SCALE : 16 * SCALE;
  const totalCardH = 128 * SCALE;
  const rowsH = data.rows.length * (40 * SCALE);
  const badgeH = 44 * SCALE;
  const noteH = noteLines.length ? noteLines.length * (18 * SCALE) + 14 * SCALE : 0;
  const barcodeH = 70 * SCALE;
  const footerH = 92 * SCALE;

  const height =
    BANNER_H +
    32 * SCALE + // gap after banner
    greetingH +
    totalCardH +
    24 * SCALE + // gap
    rowsH +
    20 * SCALE + // gap
    badgeH +
    noteH +
    28 * SCALE + // gap before barcode
    barcodeH +
    footerH;

  return { height: Math.ceil(height), noteLines };
}

async function renderCanvas(data: ReceiptData): Promise<HTMLCanvasElement> {
  const logo = await loadImage(zunoLogo);

  // Scratch context purely for measuring text before we know the final height.
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d")!;
  const { height, noteLines } = measure(measureCtx, data);

  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Clip everything to one rounded outer card so we don't need to special-case
  // corners on the banner vs. the body.
  roundRectPath(ctx, 0, 0, CARD_W, height, RADIUS);
  ctx.save();
  ctx.clip();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CARD_W, height);

  // --- Banner ---
  const grad = ctx.createLinearGradient(0, 0, CARD_W, BANNER_H);
  grad.addColorStop(0, GOLD_1);
  grad.addColorStop(1, GOLD_2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CARD_W, BANNER_H);

  if (logo) {
    const logoH = 26 * SCALE;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, PAD, 20 * SCALE, logoW, logoH);
  }
  ctx.fillStyle = BANNER_INK;
  ctx.font = `800 ${19 * SCALE}px ${FONT}`;
  ctx.fillText(data.kind === "payment" ? "Payment Receipt" : "Payout Receipt", PAD, 76 * SCALE);
  ctx.globalAlpha = 0.8;
  ctx.font = `600 ${12.5 * SCALE}px ${FONT}`;
  ctx.fillText(`#${data.id}`, PAD, 96 * SCALE);
  ctx.globalAlpha = 1;

  let y = BANNER_H + 32 * SCALE;

  // --- Greeting ---
  if (data.greetingName) {
    ctx.fillStyle = ACCENT;
    ctx.font = `800 ${17 * SCALE}px ${FONT}`;
    ctx.fillText(`Hi ${data.greetingName},`, PAD, y);
    y += 24 * SCALE;
    ctx.fillStyle = MUTED;
    ctx.font = `500 ${12.5 * SCALE}px ${FONT}`;
    ctx.fillText(
      data.kind === "payment"
        ? "Thanks for paying safely through ZUNO."
        : "Thanks for selling safely through ZUNO.",
      PAD,
      y,
    );
    y += 40 * SCALE;
  } else {
    y += 16 * SCALE;
  }

  // --- Total card ---
  const totalCardH = 128 * SCALE;
  const cardGrad = ctx.createLinearGradient(0, y, 0, y + totalCardH);
  cardGrad.addColorStop(0, INK_SOFT);
  cardGrad.addColorStop(1, INK);
  ctx.fillStyle = cardGrad;
  roundRectPath(ctx, PAD - 4 * SCALE, y, CARD_W - (PAD - 4 * SCALE) * 2, totalCardH, 16 * SCALE);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.65;
  ctx.font = `700 ${10.5 * SCALE}px ${FONT}`;
  ctx.fillText(data.totalLabel.toUpperCase(), PAD + 12 * SCALE, y + 30 * SCALE);
  ctx.globalAlpha = 1;
  ctx.font = `800 ${27 * SCALE}px ${FONT}`;
  ctx.fillText(data.totalValue, PAD + 12 * SCALE, y + 66 * SCALE);

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1 * SCALE;
  ctx.beginPath();
  ctx.moveTo(PAD + 12 * SCALE, y + 84 * SCALE);
  ctx.lineTo(CARD_W - PAD - 12 * SCALE, y + 84 * SCALE);
  ctx.stroke();

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${11 * SCALE}px ${FONT}`;
  ctx.fillText(`Ref  #${data.id}`, PAD + 12 * SCALE, y + 106 * SCALE);
  ctx.globalAlpha = 1;

  y += totalCardH + 24 * SCALE;

  // --- Detail rows ---
  const rowH = 40 * SCALE;
  for (const row of data.rows) {
    ctx.strokeStyle = BORDER;
    ctx.lineWidth = 1 * SCALE;
    ctx.beginPath();
    ctx.moveTo(PAD, y + rowH - 1 * SCALE);
    ctx.lineTo(CARD_W - PAD, y + rowH - 1 * SCALE);
    ctx.stroke();

    ctx.fillStyle = MUTED;
    ctx.font = `500 ${12.5 * SCALE}px ${FONT}`;
    ctx.fillText(row.label, PAD, y + 24 * SCALE);

    ctx.fillStyle = INK;
    ctx.font = `700 ${12.5 * SCALE}px ${FONT}`;
    const valueWidth = ctx.measureText(row.value).width;
    ctx.fillText(row.value, CARD_W - PAD - valueWidth, y + 24 * SCALE);

    y += rowH;
  }

  y += 20 * SCALE;

  // --- Protected badge ---
  const badgeH = 44 * SCALE;
  const badgeText = "Protected by ZUNO";
  ctx.font = `700 ${12.5 * SCALE}px ${FONT}`;
  const badgeTextW = ctx.measureText(badgeText).width;
  const iconSize = 16 * SCALE;
  const badgeW = iconSize + 10 * SCALE + badgeTextW + 28 * SCALE;
  ctx.fillStyle = BADGE_BG;
  roundRectPath(ctx, PAD, y, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  drawShield(ctx, PAD + 14 * SCALE, y + (badgeH - iconSize * 1.1) / 2, iconSize, BADGE_TEXT);
  ctx.fillStyle = BADGE_TEXT;
  ctx.fillText(badgeText, PAD + 14 * SCALE + iconSize + 10 * SCALE, y + badgeH / 2 + 4.5 * SCALE);

  y += badgeH;

  // --- Note ---
  if (noteLines.length) {
    y += 14 * SCALE;
    ctx.fillStyle = LIGHT_MUTED;
    ctx.font = `500 ${10.5 * SCALE}px ${FONT}`;
    for (const line of noteLines) {
      ctx.fillText(line, PAD, y);
      y += 18 * SCALE;
    }
  }

  y += 28 * SCALE;

  // --- Decorative barcode strip ---
  const rand = seededRandom(data.id);
  const barcodeH = 44 * SCALE;
  const barcodeW = CARD_W - PAD * 2;
  let bx = PAD;
  ctx.fillStyle = INK;
  while (bx < PAD + barcodeW) {
    const barW = (rand() > 0.75 ? 2.4 : 1) * SCALE;
    const barH = barcodeH * (0.55 + rand() * 0.45);
    ctx.fillRect(bx, y + (barcodeH - barH), barW, barH);
    bx += barW + rand() * 3 * SCALE + 1.5 * SCALE;
  }
  y += barcodeH + 10 * SCALE;
  ctx.fillStyle = LIGHT_MUTED;
  ctx.font = `600 ${9.5 * SCALE}px ${FONT}`;
  const idLabel = `ZUNO · ${data.id}`;
  const idLabelW = ctx.measureText(idLabel).width;
  ctx.fillText(idLabel, PAD + barcodeW / 2 - idLabelW / 2, y);

  y += 26 * SCALE;

  // --- Footer ---
  ctx.strokeStyle = BORDER;
  ctx.setLineDash([3 * SCALE, 3 * SCALE]);
  ctx.beginPath();
  ctx.moveTo(PAD, y);
  ctx.lineTo(CARD_W - PAD, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += 26 * SCALE;

  ctx.fillStyle = INK;
  ctx.font = `700 ${12 * SCALE}px ${FONT}`;
  const line1 = "ZUNO Pay · zuno.co.ke";
  ctx.fillText(line1, CARD_W / 2 - ctx.measureText(line1).width / 2, y);

  y += 20 * SCALE;
  ctx.fillStyle = LIGHT_MUTED;
  ctx.font = `500 ${10 * SCALE}px ${FONT}`;
  const line2 = "Secure · Simple · Trusted";
  ctx.fillText(line2, CARD_W / 2 - ctx.measureText(line2).width / 2, y);

  ctx.restore();
  return canvas;
}

async function buildPdfBlob(data: ReceiptData): Promise<{ blob: Blob; canvas: HTMLCanvasElement }> {
  const canvas = await renderCanvas(data);
  const imgData = canvas.toDataURL("image/png", 1.0);

  const pxToMm = 25.4 / 96;
  const pdfW = (canvas.width / SCALE) * pxToMm;
  const pdfH = (canvas.height / SCALE) * pxToMm;

  const pdf = new jsPDF({
    unit: "mm",
    format: [pdfW, pdfH],
  });
  pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH, undefined, "FAST");
  const blob = pdf.output("blob");
  return { blob, canvas };
}

function filenameFor(data: ReceiptData) {
  return `ZUNO-Receipt-${data.id}.pdf`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Generates the receipt PDF and downloads it directly — no popup window,
 * no print dialog. Works the same on mobile and desktop. */
export async function downloadReceipt(data: ReceiptData): Promise<void> {
  try {
    const { blob } = await buildPdfBlob(data);
    triggerBlobDownload(blob, filenameFor(data));
  } catch {
    toast.error("Couldn't generate the receipt. Please try again.");
  }
}

/** Shares the receipt PDF via the native share sheet when available (mobile
 * Safari/Chrome), otherwise falls back to a plain download. */
export async function shareReceipt(data: ReceiptData): Promise<void> {
  try {
    const { blob } = await buildPdfBlob(data);
    const filename = filenameFor(data);
    const file = new File([blob], filename, { type: "application/pdf" });

    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
      share?: (data: ShareData) => Promise<void>;
    };

    if (nav.canShare?.({ files: [file] }) && nav.share) {
      await nav.share({
        files: [file],
        title: filename,
        text: `ZUNO receipt #${data.id}`,
      });
      return;
    }

    if (nav.share) {
      await nav.share({ title: filename, text: `ZUNO receipt #${data.id} · zuno.co.ke` });
      return;
    }

    triggerBlobDownload(blob, filename);
    toast.info("Sharing isn't supported on this browser — downloaded the receipt instead.");
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return;
    toast.error("Couldn't share the receipt. Please try again.");
  }
}
