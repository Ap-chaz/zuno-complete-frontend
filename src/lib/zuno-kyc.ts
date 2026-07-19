// Client-side KYC status helper for the ZUNO prototype.
// In production this MUST be mirrored on the backend — every transaction
// endpoint should refuse requests from users whose KYC status !== "verified".

export type KycStatus = "unverified" | "pending" | "verified";

const STATUS_KEY = "zuno_kyc_status";
const DRAFT_KEY = "zuno_kyc_draft";
const INTENT_KEY = "zuno_kyc_intent";

function safeWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

export function getKycStatus(): KycStatus {
  const w = safeWindow();
  if (!w) return "unverified";
  try {
    const v = w.localStorage.getItem(STATUS_KEY);
    return v === "verified" || v === "pending" ? v : "unverified";
  } catch {
    return "unverified";
  }
}

export function isKycVerified(): boolean {
  return getKycStatus() === "verified";
}

export function setKycStatus(status: KycStatus) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(STATUS_KEY, status);
    // Draft no longer needed once verified.
    if (status === "verified") w.sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}

export function saveKycDraft(data: unknown) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

export function loadKycDraft<T = unknown>(): T | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const v = w.sessionStorage.getItem(DRAFT_KEY);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function setKycIntent(path: string) {
  const w = safeWindow();
  if (!w) return;
  try {
    w.sessionStorage.setItem(INTENT_KEY, path);
  } catch {}
}

export function consumeKycIntent(): string | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const v = w.sessionStorage.getItem(INTENT_KEY);
    if (v) w.sessionStorage.removeItem(INTENT_KEY);
    return v;
  } catch {
    return null;
  }
}

/**
 * Backend-style guard. Any mocked transaction handler should call this
 * before mutating state so a UI bypass still fails loudly.
 */
export function assertKycVerified() {
  if (!isKycVerified()) {
    const err = new Error("KYC_REQUIRED");
    (err as Error & { code?: string }).code = "KYC_REQUIRED";
    throw err;
  }
}
