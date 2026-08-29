// Central rule for "who gets displayed to buyers" and "who counts as verified".
// Keep this as the single source of truth — don't re-implement the check inline
// elsewhere, so the bar for going live only ever needs to change in one place.

import type { Seller, SellerVerificationTier } from "@/types/models";

/** Resolves a tier even for older seed/mock data that only set `verified: boolean`. */
export function getSellerTier(seller: Seller): SellerVerificationTier {
  if (seller.verificationTier) return seller.verificationTier;
  return seller.verified ? "verified" : "unverified";
}

/**
 * Whether a seller should be shown in buyer-facing listings (search, category
 * browse, featured placement). Sellers that fail this can still exist in the
 * system (e.g. mid-review, or flagged pending a dispute outcome) — they're
 * just not surfaced to buyers yet.
 */
export function isEligibleForDisplay(seller: Seller): boolean {
  if (seller.suspended) return false;
  const tier = getSellerTier(seller);
  const disputes = seller.disputeCount ?? 0;
  return tier === "verified" && disputes === 0;
}

/** Short label for seller cards — distinguishes brand-new verified sellers from established ones. */
export function getSellerTrustLabel(seller: Seller): string {
  const tier = getSellerTier(seller);
  if (tier === "flagged") return "Under review";
  if (tier === "pending") return "Verification pending";
  if (tier === "unverified") return "New seller";
  return seller.deals >= 3 ? "Verified" : "Newly verified";
}
