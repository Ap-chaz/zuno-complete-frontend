// Client-side business verification status for the SELLER's own submission.
// Same "prototype only" caveat as zuno-kyc.ts: in production, submission must
// go to a real endpoint and an admin queue, and this status must be mirrored
// server-side before a seller is allowed to display / accept escrow deals.

import type { SellerVerificationTier } from "@/types/models";

export interface BusinessVerificationSubmission {
  category: string;
  businessRegNumber: string;
  kraPin: string;
  location: string;
  businessPhone: string;
  payoutMethod: "mpesa" | "bank";
  payoutDetails: string;
  payoutBankName?: string;
  documentName: string;
  submittedAt: string;
}

const TIER_KEY = "zuno_seller_verification_tier";
const SUBMISSION_KEY = "zuno_seller_verification_submission";

function safeWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

export function getSellerVerificationTier(): SellerVerificationTier {
  const w = safeWindow();
  if (!w) return "unverified";
  try {
    const v = w.localStorage.getItem(TIER_KEY);
    if (v === "verified" || v === "pending" || v === "flagged") return v;
    return "unverified";
  } catch {
    return "unverified";
  }
}

export function submitBusinessVerification(data: BusinessVerificationSubmission) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(SUBMISSION_KEY, JSON.stringify(data));
    w.localStorage.setItem(TIER_KEY, "pending" satisfies SellerVerificationTier);
  } catch {}
}

export function getSellerVerificationSubmission(): BusinessVerificationSubmission | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const v = w.localStorage.getItem(SUBMISSION_KEY);
    return v ? (JSON.parse(v) as BusinessVerificationSubmission) : null;
  } catch {
    return null;
  }
}
