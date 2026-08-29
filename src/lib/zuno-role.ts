export type ZunoRole = "buyer" | "seller";

const KEY = "zuno_role";

export function setRole(role: ZunoRole) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, role);
  } catch {
    // ignore
  }
}

export function getRole(): ZunoRole | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "buyer" || v === "seller" ? v : null;
  } catch {
    return null;
  }
}

export function clearRole() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
