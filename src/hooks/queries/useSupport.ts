import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/support.service";

export const supportKeys = {
  all: ["support-tickets"] as const,
};

export function useSupportTickets() {
  return useQuery({
    queryKey: supportKeys.all,
    queryFn: () => supportService.list(),
  });
}

export function useResolveSupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supportService.resolve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.all });
    },
  });
}
