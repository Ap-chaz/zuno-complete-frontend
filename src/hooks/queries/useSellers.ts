import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sellersService } from "@/services/sellers.service";

export const sellerKeys = {
  all: ["sellers"] as const,
  detail: (id: string) => ["sellers", id] as const,
  search: (query: string, category: string) => ["sellers", "search", query, category] as const,
};

export function useSellers() {
  return useQuery({
    queryKey: sellerKeys.all,
    queryFn: () => sellersService.list(),
  });
}

export function useSeller(id: string | undefined) {
  return useQuery({
    queryKey: sellerKeys.detail(id ?? ""),
    queryFn: () => sellersService.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useSellerSearch(query: string, category: string) {
  return useQuery({
    queryKey: sellerKeys.search(query, category),
    queryFn: () => sellersService.search(query, category),
    placeholderData: (prev) => prev,
  });
}

export function useToggleSellerSuspend() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, suspended }: { id: string; suspended: boolean }) =>
      sellersService.toggleSuspend(id, suspended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerKeys.all });
    },
  });
}
