import { apiClient } from "@/lib/api/client";
import { mockResolve } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import type { Dispute } from "@/types/models";

const MOCK_DISPUTES: Dispute[] = [
  {
    id: "d1",
    transactionId: "ZUNO9DF8GH7JK6",
    reason: "Item not as described",
    description: "The drone arrived with a different battery than advertised.",
    status: "under_review",
    createdAt: "2026-05-20T09:00:00.000Z",
    evidenceUrls: [],
  },
];

export const disputesService = {
  async list(): Promise<Dispute[]> {
    if (env.useMockApi) return mockResolve([...MOCK_DISPUTES]);
    return apiClient.get<Dispute[]>("/disputes");
  },

  async create(input: { transactionId: string; reason: string; description: string }): Promise<Dispute> {
    if (env.useMockApi) {
      const created: Dispute = {
        id: `d${Math.random().toString(36).slice(2, 8)}`,
        transactionId: input.transactionId,
        reason: input.reason,
        description: input.description,
        status: "open",
        createdAt: new Date().toISOString(),
        evidenceUrls: [],
      };
      MOCK_DISPUTES.unshift(created);
      return mockResolve(created);
    }
    return apiClient.post<Dispute>("/disputes", input);
  },

  /**
   * Admin-only: record a binding resolution. In production this must also
   * trigger the actual fund movement (refund or release) server-side — this
   * mock only updates the dispute record, it does not move any money.
   */
  async resolve(input: {
    id: string;
    resolvedInFavorOf: "buyer" | "seller";
    resolutionNote: string;
  }): Promise<Dispute> {
    if (env.useMockApi) {
      const idx = MOCK_DISPUTES.findIndex((d) => d.id === input.id);
      if (idx === -1) throw new Error("Dispute not found");
      const updated: Dispute = {
        ...MOCK_DISPUTES[idx],
        status: "resolved",
        resolvedInFavorOf: input.resolvedInFavorOf,
        resolutionNote: input.resolutionNote,
        resolvedAt: new Date().toISOString(),
      };
      MOCK_DISPUTES[idx] = updated;
      return mockResolve(updated);
    }
    return apiClient.post<Dispute>(`/disputes/${input.id}/resolve`, input);
  },
};
