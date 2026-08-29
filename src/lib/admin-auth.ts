// Stopgap access control for /admin/* routes. See env.ts adminPasscode
// comment: this is a deterrent (a shared passcode), not real authentication.
// It intentionally does NOT persist across browser restarts (sessionStorage,
// not localStorage) so a lost/shared device doesn't stay open indefinitely.

const SESSION_KEY = "zuno_admin_session";

function safeWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

export function isAdminSessionActive(): boolean {
  const w = safeWindow();
  if (!w) return false;
  try {
    return w.sessionStorage.getItem(SESSION_KEY) === "active";
  } catch {
    return false;
  }
}

export function tryAdminLogin(passcode: string, expected: string): boolean {
  if (!expected) {
    // No passcode configured — fail closed rather than silently letting everyone in.
    return false;
  }
  const ok = passcode === expected;
  if (ok) {
    const w = safeWindow();
    try {
      w?.sessionStorage.setItem(SESSION_KEY, "active");
    } catch {}
  }
  return ok;
}

export function adminLogout(): void {
  const w = safeWindow();
  try {
    w?.sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
