/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult, useQueryClient } from "react-query";

export function useRemoveFromQueue(): UseMutationResult<
  any,
  unknown,
  number,
  {
    previousQueue: string[];
  }
> {
  const queryClient = useQueryClient();

  const removeFromQueueMutation = useMutation(
    async (index: number) => {
      const response = await fetch("/api/remove-from-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      if (!response.ok) {
        throw new Error("Failed to remove from queue");
      }

      return response.json().then((data) => data.queue);
    },
    {
      onMutate: async (index) => {
        await queryClient.cancelQueries("queue");
        const previousQueue = queryClient.getQueryData<string[]>("queue") || [];
        const newQueue = previousQueue.filter((_, i) => i !== index);
        queryClient.setQueryData("queue", newQueue);
        return { previousQueue };
      },
      onError: (_err, _index, context) => {
        if (context?.previousQueue) {
          queryClient.setQueryData("queue", context.previousQueue);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries("queue");
      },
    },
  );
  return removeFromQueueMutation;
}
