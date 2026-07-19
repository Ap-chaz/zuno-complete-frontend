import { env } from "@/config/env";

/**
 * Normalized error shape thrown by both the real HTTP client and the mock
 * adapter, so calling code (React Query, components) only ever has to
 * handle one error type regardless of which backend is active.
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status = 0, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token = window.localStorage.getItem("zuno_auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.apiTimeoutMs ?? 15_000);

  try {
    const res = await fetch(`${env.apiBaseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
        ...init.headers,
      },
    });

    if (!res.ok) {
      let message = res.statusText || "Request failed";
      let code: string | undefined;
      try {
        const body = await res.json();
        message = body?.message ?? message;
        code = body?.code;
      } catch {
        // Non-JSON error body — fall back to statusText.
      }
      throw new ApiError(message, res.status, code);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request timed out. Check your connection and try again.", 0, "TIMEOUT");
    }
    throw new ApiError(
      err instanceof Error ? err.message : "Network error. Please try again.",
      0,
      "NETWORK_ERROR",
    );
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Thin REST client. Only used once `env.useMockApi` is false. Every method
 * mirrors the mock adapter's async signature so services don't need an
 * `if (mock)` branch anywhere except in their own `index.ts`.
 */
export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
