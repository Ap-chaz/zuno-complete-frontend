import { apiClient } from "@/lib/api/client";
import { mockResolve, mockReject } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import { sellers as seedSellers, categories as seedCategories } from "@/lib/zuno-data";
import type { Seller } from "@/types/models";

// Adapts the shared seed data (see transactions.service.ts for the rationale).
const MOCK_SELLERS: Seller[] = seedSellers;

export const SELLER_CATEGORIES = seedCategories;

export const sellersService = {
  async list(): Promise<Seller[]> {
    if (env.useMockApi) return mockResolve([...MOCK_SELLERS]);
    return apiClient.get<Seller[]>("/sellers");
  },

  async getById(id: string): Promise<Seller> {
    if (env.useMockApi) {
      const found = MOCK_SELLERS.find((s) => s.id === id);
      if (!found) return mockReject(`Seller ${id} not found`, 404, "NOT_FOUND");
      return mockResolve(found);
    }
    return apiClient.get<Seller>(`/sellers/${id}`);
  },

  async search(query: string, category = "All"): Promise<Seller[]> {
    const all = await this.list();
    const q = query.trim().toLowerCase();
    return all.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        !q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  },

  /** Admin-only: suspend hides a seller from buyer listings regardless of verification tier. */
  async toggleSuspend(id: string, suspended: boolean): Promise<Seller> {
    if (env.useMockApi) {
      const found = MOCK_SELLERS.find((s) => s.id === id);
      if (!found) return mockReject(`Seller ${id} not found`, 404, "NOT_FOUND");
      found.suspended = suspended;
      return mockResolve(found);
    }
    return apiClient.patch<Seller>(`/sellers/${id}`, { suspended });
  },
};
