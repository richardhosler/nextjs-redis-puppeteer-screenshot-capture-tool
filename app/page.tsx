"use client";

import { SiteSubmitter } from "../components/SiteSubmitter";
import { ResultList } from "../components/ResultList";
import { ImageViewer } from "../components/ImageViewer";
import { useState } from "react";
import { parseURL } from "@/lib/parseUrl";
import { useQuery, useMutation, useQueryClient } from "react-query";

export default function Home(): JSX.Element {
  const [selectedImage, setSelectedImage] = useState(
    "/no-image-placeholder.png",
  );
  const [url, setUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: queue = [] } = useQuery("queue", async () => {
    const response = await fetch("/api/get-queue");
    if (!response.ok) throw new Error("Failed to fetch queue");
    return response.json().then((data) => data.queue);
  });

  const { data: results = [] } = useQuery("results", async () => {
    const response = await fetch("/api/get-results");
    if (!response.ok) throw new Error("Failed to fetch results");
    return response.json().then((data) => data.results);
  });

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

  const removeFromQueueMutation = useMutation(
    async (index: number) => {
      const response = await fetch("/api/remove-from-queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      if (!response.ok) throw new Error("Failed to remove from queue");
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

  const handleAddToQueue = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const parsedURL = parseURL(url);
    if (parsedURL !== false) {
      addToQueueMutation.mutate(parsedURL);
      setUrl("");
    }
  };

  const handleRemoveFromQueue = (index: number): void => {
    removeFromQueueMutation.mutate(index);
  };

  const handleSetImage = (src: string): void => {
    setSelectedImage(`/${src}`);
  };

  return (
    <div className="main">
      <SiteSubmitter
        queue={queue}
        handleRemoveFromQueue={handleRemoveFromQueue}
        handleAddToQueue={handleAddToQueue}
        setUrl={setUrl}
        url={url}
      />
      <ResultList onSetImage={handleSetImage} results={results} />
      <ImageViewer src={selectedImage} />
    </div>
  );
}
