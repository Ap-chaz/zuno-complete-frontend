import { apiClient } from "@/lib/api/client";
import { mockResolve, mockReject } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import { transactions as seedTransactions, sellers as seedSellers } from "@/lib/zuno-data";
import type { Transaction, TxStatus } from "@/types/models";

// `zuno-data.ts` remains the single source of seed data (still consumed
// directly by routes not yet migrated to the service layer). We adapt it
// here to the richer `Transaction` shape rather than keeping a second copy,
// so the two can't drift out of sync.
const MOCK_TRANSACTIONS: Transaction[] = seedTransactions.map((t) => ({
  ...t,
  currency: "KES",
  sellerId: seedSellers.find((s) => s.name === t.seller)?.id ?? t.seller.toLowerCase().replace(/\s+/g, "-"),
}));

export const ACTIVE_STATUSES: TxStatus[] = ["Pending", "Funded", "Protected", "Disputed"];

export function formatCurrency(amount: number, currency: Transaction["currency"] = "KES"): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function statusColorClass(s: TxStatus): string {
  switch (s) {
    case "Completed":
      return "bg-success/15 text-success border-success/30";
    case "Funded":
    case "Protected":
      return "bg-accent/20 text-accent border-accent/30";
    case "Pending":
      return "bg-gold/15 text-gold border-gold/30";
    case "Refunded":
      return "bg-muted text-muted-foreground border-border";
    case "Disputed":
      return "bg-destructive/15 text-destructive border-destructive/30";
  }
}

export const transactionsService = {
  async list(): Promise<Transaction[]> {
    if (env.useMockApi) return mockResolve([...MOCK_TRANSACTIONS]);
    return apiClient.get<Transaction[]>("/transactions");
  },

  async getById(id: string): Promise<Transaction> {
    if (env.useMockApi) {
      const found = MOCK_TRANSACTIONS.find((t) => t.id === id);
      if (!found) return mockReject(`Transaction ${id} not found`, 404, "NOT_FOUND");
      return mockResolve(found);
    }
    return apiClient.get<Transaction>(`/transactions/${id}`);
  },

  async listActive(): Promise<Transaction[]> {
    const all = await this.list();
    return all.filter((t) => ACTIVE_STATUSES.includes(t.status));
  },

  async create(input: Omit<Transaction, "id" | "date" | "status">): Promise<Transaction> {
    if (env.useMockApi) {
      const created: Transaction = {
        ...input,
        id: `ZUNO${Math.random().toString(36).slice(2, 12).toUpperCase()}`,
        date: new Date().toISOString().slice(0, 10),
        status: "Pending",
      };
      MOCK_TRANSACTIONS.unshift(created);
      return mockResolve(created);
    }
    return apiClient.post<Transaction>("/transactions", input);
  },

  async updateStatus(id: string, status: TxStatus): Promise<Transaction> {
    if (env.useMockApi) {
      const found = MOCK_TRANSACTIONS.find((t) => t.id === id);
      if (!found) return mockReject(`Transaction ${id} not found`, 404, "NOT_FOUND");
      found.status = status;
      return mockResolve(found);
    }
    return apiClient.patch<Transaction>(`/transactions/${id}`, { status });
  },

  /** Admin-only: mark/unmark a transaction for manual fraud review. */
  async toggleFlag(id: string, flagged: boolean): Promise<Transaction> {
    if (env.useMockApi) {
      const found = MOCK_TRANSACTIONS.find((t) => t.id === id);
      if (!found) return mockReject(`Transaction ${id} not found`, 404, "NOT_FOUND");
      found.flaggedForReview = flagged;
      return mockResolve(found);
    }
    return apiClient.patch<Transaction>(`/transactions/${id}`, { flaggedForReview: flagged });
  },

  /**
   * Admin-only: record that the actual money (seller payout or buyer refund)
   * has been sent. This does NOT move any real money itself — it's a manual
   * checkbox until a real payment integration exists.
   */
  async markPayoutPaid(id: string): Promise<Transaction> {
    if (env.useMockApi) {
      const found = MOCK_TRANSACTIONS.find((t) => t.id === id);
      if (!found) return mockReject(`Transaction ${id} not found`, 404, "NOT_FOUND");
      found.payoutStatus = "paid";
      return mockResolve(found);
    }
    return apiClient.patch<Transaction>(`/transactions/${id}`, { payoutStatus: "paid" });
  },
};
