import { env } from "@/config/env";
import { ApiError } from "@/lib/api/client";

/**
 * Wraps a synchronous mock data lookup so it behaves like a real network
 * call: it resolves asynchronously, after a small delay, and can simulate
 * a "not found" style failure. This keeps loading/skeleton states
 * exercised in local dev even though there's no real backend yet.
 */
export async function mockResolve<T>(value: T, latencyMs = env.mockLatencyMs): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  return value;
}

export async function mockReject(message: string, status = 404, code?: string): Promise<never> {
  await new Promise((resolve) => setTimeout(resolve, env.mockLatencyMs));
  throw new ApiError(message, status, code);
}
