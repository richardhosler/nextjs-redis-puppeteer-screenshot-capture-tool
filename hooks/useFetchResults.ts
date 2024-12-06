import { useEffect } from "react";
import { useQuery } from "react-query";

export const useFetchResults = (queue: string[]): string[] => {
  const { data: results = [], refetch } = useQuery(
    ["results", queue],
    async () => {
      const response = await fetch("/api/get-results");
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      return response.json().then((data) => data.results);
    },
  );

  useEffect(() => {
    const handleRefetch = () => {
      const timeoutId = setTimeout(() => {
        refetch();
      }, 2000);

      return (): void => clearTimeout(timeoutId);
    };

    handleRefetch();
  }, [queue]);

  return results;
};
