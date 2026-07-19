import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { disputesService } from "@/services/disputes.service";

export const disputeKeys = {
  all: ["disputes"] as const,
};

export function useDisputes() {
  return useQuery({
    queryKey: disputeKeys.all,
    queryFn: () => disputesService.list(),
  });
}

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disputesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disputesService.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.all });
    },
  });
}
