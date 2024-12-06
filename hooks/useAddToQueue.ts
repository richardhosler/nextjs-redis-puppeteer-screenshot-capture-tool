/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient, UseMutationResult } from "react-query";

export function useAddToQueue(): UseMutationResult<
  any,
  unknown,
  string,
  {
    previousQueue: string[];
  }
> {
  const queryClient = useQueryClient();
  const addToQueueMutation = useMutation(
    async (parsedURL: string) => {
      const response = await fetch("/api/add-to-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsedURL }),
      });
      if (!response.ok) throw new Error("Failed to add to queue");
      return response.json().then((data) => data.queue);
    },
    {
      onMutate: async (parsedURL) => {
        await queryClient.cancelQueries("queue");
        const previousQueue = queryClient.getQueryData<string[]>("queue") || [];
        queryClient.setQueryData("queue", [...previousQueue, parsedURL]);
        return { previousQueue };
      },
      onError: (_err, _parsedURL, context) => {
        if (context?.previousQueue) {
          queryClient.setQueryData("queue", context.previousQueue);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries("queue");
      },
    },
  );
  return addToQueueMutation;
}
