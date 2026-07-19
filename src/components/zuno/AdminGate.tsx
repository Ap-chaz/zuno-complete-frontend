import { useState } from "react";
import { Lock } from "lucide-react";
import { PhoneFrame } from "@/components/zuno/PhoneFrame";
import { TopBar } from "@/components/zuno/TopBar";
import { isAdminSessionActive, tryAdminLogin } from "@/lib/admin-auth";
import { env } from "@/config/env";

/**
 * Wrap any admin page's content with this. Renders the passcode screen until
 * unlocked for the session, then renders children. See admin-auth.ts for the
 * "deterrent, not real security" caveat — replace with real admin auth
 * before real money or real seller/buyer data is at stake.
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(isAdminSessionActive());

  if (unlocked) return <>{children}</>;

  return <AdminGateScreen onUnlock={() => setUnlocked(true)} />;
}

function AdminGateScreen({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (tryAdminLogin(passcode, env.adminPasscode)) {
      onUnlock();
    } else {
      setError("Incorrect passcode.");
    }
  }

  return (
    <PhoneFrame>
      <TopBar title="Admin Access" back="/app/account" />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gold/15 text-gold">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-lg font-bold">Admin passcode required</h1>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          This area manages sellers and disputes. It's not for general staff access yet.
        </p>
        <input
          type="password"
          value={passcode}
          onChange={(e) => {
            setPasscode(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Passcode"
          className="mt-6 h-12 w-full max-w-xs rounded-2xl border border-border/60 bg-input px-4 text-center text-sm tracking-widest outline-none focus:border-gold/50"
        />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 h-12 w-full max-w-xs rounded-2xl bg-gradient-gold text-sm font-semibold text-gold-foreground shadow-gold"
        >
          Unlock
        </button>
      </div>
    </PhoneFrame>
  );
}
