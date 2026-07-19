import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import type { Seller } from "@/types/models";
import { getSellerTier } from "@/lib/seller-eligibility";

/**
 * Drop-in replacement for the old `{seller.verified && <BadgeCheck />}` pattern.
 * Renders nothing for a plain "unverified" seller (matches prior behaviour),
 * but now also surfaces "pending" and "flagged" states instead of silently
 * showing/hiding a single checkmark.
 */
export function VerificationBadge({ seller, className = "h-4 w-4 shrink-0" }: { seller: Seller; className?: string }) {
  const tier = getSellerTier(seller);

  if (tier === "verified") return <BadgeCheck className={`${className} text-gold`} />;
  if (tier === "pending") return <Clock className={`${className} text-muted-foreground`} />;
  if (tier === "flagged") return <ShieldAlert className={`${className} text-destructive`} />;
  return null;
}
