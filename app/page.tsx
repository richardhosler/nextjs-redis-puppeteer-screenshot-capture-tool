"use client";

import { SiteSubmitter } from "../components/SiteSubmitter";
import { ResultList } from "../components/ResultList";
import { ImageViewer } from "../components/ImageViewer";
import { useState } from "react";
import { parseURL } from "@/lib/parse-url";
import { useRemoveFromQueue } from "@/hooks/useRemoveFromQueue";
import { useAddToQueue } from "@/hooks/useAddToQueue";
import { useFetchQueue } from "@/hooks/useFetchQueue";
import { useFetchResults } from "@/hooks/useFetchResults";

export default function Home(): JSX.Element {
  const removeFromQueue = useRemoveFromQueue();
  const addToQueue = useAddToQueue();
  const queue = useFetchQueue();
  const results = useFetchResults(queue);
  const [url, setUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const handleAddToQueue = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const parsedURL = parseURL(url);
    if (parsedURL !== false && parsedURL !== true) {
      addToQueue.mutate(parsedURL);
      setUrl("");
    }
  };

  const handleRemoveFromQueue = (index: number): void => {
    removeFromQueue.mutate(index);
  };

  const handleSetImage = (src: string): void => {
    setSelectedImage(`/${src}`);
  };

  return (
    <div className="main">
      <SiteSubmitter
        queue={queue}
        onHandleRemoveFromQueue={handleRemoveFromQueue}
        onHandleAddToQueue={handleAddToQueue}
        setUrl={setUrl}
        url={url}
      />
      <ResultList onSetImage={handleSetImage} results={results} />
      <ImageViewer src={selectedImage} />
    </div>
  );
}
