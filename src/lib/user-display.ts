import type { User } from "@/types/models";

/** First name of the signed-in user, or a friendly fallback. */
export function getFirstName(user?: Pick<User, "name"> | null): string {
  const first = user?.name?.trim().split(/\s+/)[0];
  return first || "there";
}

/**
 * Avatar letter, always derived from the user's real name so it can never
 * drift from what's shown elsewhere (ignores any stale stored avatarInitial).
 */
export function getAvatarInitial(user?: Pick<User, "name" | "email"> | null): string {
  const source = user?.name?.trim() || user?.email?.trim() || "";
  return source ? source.charAt(0).toUpperCase() : "?";
}
