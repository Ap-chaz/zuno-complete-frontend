import { mockResolve, mockReject } from "@/lib/api/mock-adapter";
import { env } from "@/config/env";
import { apiClient } from "@/lib/api/client";
import type { SupportTicket } from "@/types/models";

// No real "contact support" submission form exists in the app yet (help.tsx
// is a static FAQ + mailto link) — these are seeded so the admin queue has
// something real-shaped to work with. Wiring an actual in-app contact form
// that writes here is a separate, smaller follow-up once this is useful.
const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "t1",
    name: "Kevin Mwangi",
    email: "kevin.mwangi@example.com",
    subject: "Payment stuck on Pending",
    message: "I funded an escrow for the DJI drone 3 days ago and it's still showing Pending. Can someone check?",
    status: "open",
    createdAt: "2026-07-02T09:15:00Z",
  },
  {
    id: "t2",
    name: "Grace Achieng",
    email: "grace.a@example.com",
    subject: "How do I become a verified seller?",
    message: "I signed up as a seller but I don't see where to submit my business documents.",
    status: "open",
    createdAt: "2026-07-03T14:40:00Z",
  },
  {
    id: "t3",
    name: "Daniel Kiprono",
    email: "d.kiprono@example.com",
    subject: "Refund not received",
    message: "My dispute was resolved in my favor 2 days ago but I haven't seen the refund in my M-Pesa yet.",
    status: "open",
    createdAt: "2026-07-04T11:05:00Z",
  },
  {
    id: "t4",
    name: "Aisha Noor",
    email: "aisha.noor@example.com",
    subject: "Can't upload ID document",
    message: "The camera option isn't opening on my phone during KYC. Gallery upload works fine though.",
    status: "resolved",
    createdAt: "2026-06-28T08:20:00Z",
  },
];

export const supportService = {
  async list(): Promise<SupportTicket[]> {
    if (env.useMockApi) return mockResolve([...MOCK_TICKETS]);
    return apiClient.get<SupportTicket[]>("/support/tickets");
  },

  async resolve(id: string): Promise<SupportTicket> {
    if (env.useMockApi) {
      const found = MOCK_TICKETS.find((t) => t.id === id);
      if (!found) return mockReject(`Ticket ${id} not found`, 404, "NOT_FOUND");
      found.status = "resolved";
      return mockResolve(found);
    }
    return apiClient.post<SupportTicket>(`/support/tickets/${id}/resolve`, {});
  },
};
