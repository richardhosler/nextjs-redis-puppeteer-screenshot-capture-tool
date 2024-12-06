import { useQuery } from "react-query";

export const useFetchQueue = (): string[] => {
  const { data: queue = [] } = useQuery(["queue"], async () => {
    const response = await fetch("/api/get-queue");
    if (!response.ok) {
      throw new Error("Failed to fetch queue");
    }

    return response.json().then((data) => data.queue);
  });

  return queue;
};
