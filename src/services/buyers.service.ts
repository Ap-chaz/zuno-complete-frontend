import { mockResolve } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import { transactionsService } from "@/services/transactions.service";
import type { BuyerSummary, KycStatus } from "@/types/models";

// In-memory only — resets on reload, same tradeoff as the seller tier
// overrides in admin.sellers.tsx. Once a real user table exists, suspension
// and KYC status belong on that record, not bolted on here.
const suspendedBuyers = new Set<string>();
const kycOverrides = new Map<string, KycStatus>();

// There's no real per-buyer KYC submission data to review (only the current
// logged-in user's own status exists, in zuno-kyc.ts). This gives each
// derived buyer a starting status so the admin queue has something to
// review — deterministic per name, not random, so it doesn't shuffle on
// every reload.
function seedKycStatus(name: string): KycStatus {
  const cycle: KycStatus[] = ["verified", "verified", "pending", "unverified"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return cycle[hash % cycle.length];
}

export const buyersService = {
  async list(): Promise<BuyerSummary[]> {
    if (env.useMockApi) {
      const transactions = await transactionsService.list();
      const byBuyer = new Map<string, BuyerSummary>();

      for (const t of transactions) {
        const name = t.buyerName ?? "Unknown buyer";
        const existing = byBuyer.get(name);
        const isDispute = t.status === "Disputed";
        if (existing) {
          existing.transactionCount += 1;
          existing.totalSpent += t.amount;
          if (isDispute) existing.disputeCount += 1;
          if (new Date(parseDate(t.date)) > new Date(parseDate(existing.lastTransactionDate))) {
            existing.lastTransactionDate = t.date;
          }
        } else {
          byBuyer.set(name, {
            name,
            transactionCount: 1,
            totalSpent: t.amount,
            disputeCount: isDispute ? 1 : 0,
            lastTransactionDate: t.date,
            suspended: suspendedBuyers.has(name),
            kycStatus: kycOverrides.get(name) ?? seedKycStatus(name),
          });
        }
      }

      return mockResolve([...byBuyer.values()].sort((a, b) => b.totalSpent - a.totalSpent));
    }
    return apiClient.get<BuyerSummary[]>("/buyers");
  },

  async toggleSuspend(name: string, suspended: boolean): Promise<void> {
    if (env.useMockApi) {
      if (suspended) suspendedBuyers.add(name);
      else suspendedBuyers.delete(name);
      return mockResolve<void>(undefined);
    }
    await apiClient.patch(`/buyers/${encodeURIComponent(name)}`, { suspended });
  },

  async setKycStatus(name: string, status: KycStatus): Promise<void> {
    if (env.useMockApi) {
      kycOverrides.set(name, status);
      return mockResolve<void>(undefined);
    }
    await apiClient.patch(`/buyers/${encodeURIComponent(name)}`, { kycStatus: status });
  },
};

// Seed dates are "DD/MM/YYYY" strings — convert to something Date() parses correctly.
function parseDate(d: string): string {
  const [day, month, year] = d.split("/");
  return `${year}-${month}-${day}`;
}
