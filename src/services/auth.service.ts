import { apiClient, ApiError } from "@/lib/api/client";
import { mockResolve, mockReject } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import type { AuthSession, User, ZunoRole } from "@/types/models";

const TOKEN_KEY = "zuno_auth_token";
const USER_KEY = "zuno_auth_user";
// Deliberately separate from the active session keys above: a normal
// logout clears TOKEN_KEY/USER_KEY, but biometric login needs something to
// restore even after that — this snapshot is only cleared when the person
// explicitly turns biometric login off (or logs out "everywhere").
const BIOMETRIC_TOKEN_KEY = "zuno_biometric_token";
const BIOMETRIC_USER_KEY = "zuno_biometric_user";

export interface LoginInput {
  identifier: string; // email or phone
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: ZunoRole;
}

function persistSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function saveBiometricSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BIOMETRIC_TOKEN_KEY, session.token);
  window.localStorage.setItem(BIOMETRIC_USER_KEY, JSON.stringify(session.user));
}

function getBiometricSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const token = window.localStorage.getItem(BIOMETRIC_TOKEN_KEY);
    const rawUser = window.localStorage.getItem(BIOMETRIC_USER_KEY);
    if (!token || !rawUser) return null;
    return { token, user: JSON.parse(rawUser) as User };
  } catch {
    return null;
  }
}

function clearBiometricSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BIOMETRIC_TOKEN_KEY);
  window.localStorage.removeItem(BIOMETRIC_USER_KEY);
}

function mockUser(overrides: Partial<User> = {}): User {
  return {
    id: "usr_demo_001",
    name: "Alvan Otieno",
    email: "alvan@example.com",
    phone: "+254700000000",
    role: "buyer",
    kycStatus: "unverified",
    trustScore: 850,
    avatarInitial: "A",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    if (!input.identifier.trim() || !input.password.trim()) {
      return mockReject("Enter your email/phone and password.", 400, "VALIDATION_ERROR");
    }
    if (env.useMockApi) {
      const session: AuthSession = {
        user: mockUser({ email: input.identifier, name: "Alvan Otieno" }),
        token: `mock-token-${Date.now()}`,
      };
      persistSession(session);
      if (getBiometricSession()) saveBiometricSession(session);
      return mockResolve(session);
    }
    const session = await apiClient.post<AuthSession>("/auth/login", input);
    persistSession(session);
    if (getBiometricSession()) saveBiometricSession(session);
    return session;
  },

  async signup(input: SignupInput): Promise<AuthSession> {
    if (!input.name.trim() || !input.email.trim() || !input.password.trim()) {
      return mockReject("Fill in all required fields.", 400, "VALIDATION_ERROR");
    }
    if (env.useMockApi) {
      const session: AuthSession = {
        user: mockUser({ name: input.name, email: input.email, phone: input.phone, role: input.role }),
        token: `mock-token-${Date.now()}`,
      };
      persistSession(session);
      return mockResolve(session);
    }
    const session = await apiClient.post<AuthSession>("/auth/signup", input);
    persistSession(session);
    return session;
  },

  async requestPasswordReset(identifier: string): Promise<{ sent: true }> {
    if (!identifier.trim()) {
      return mockReject("Enter the email or phone linked to your account.", 400, "VALIDATION_ERROR");
    }
    if (env.useMockApi) return mockResolve({ sent: true });
    return apiClient.post("/auth/forgot-password", { identifier });
  },

  async logout(): Promise<void> {
    clearSession();
    if (!env.useMockApi) {
      try {
        await apiClient.post("/auth/logout");
      } catch {
        // Best-effort — session is already cleared locally.
      }
    }
  },

  getStoredSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const token = window.localStorage.getItem(TOKEN_KEY);
      const rawUser = window.localStorage.getItem(USER_KEY);
      if (!token || !rawUser) return null;
      return { token, user: JSON.parse(rawUser) as User };
    } catch {
      return null;
    }
  },

  /** Snapshot used by biometric login — deliberately survives a normal logout. */
  getBiometricSession,
  saveBiometricSession,
  clearBiometricSession,
  /** Re-establishes a session as the active one (sets the normal token/user keys the rest of the app reads). */
  activateSession: persistSession,
};

export { ApiError };
