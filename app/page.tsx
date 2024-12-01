"use client";

import { SiteSubmitter } from "../components/SiteSubmitter";
import { ResultList } from "../components/ResultList";
import { ImageViewer } from "../components/ImageViewer";
import { useEffect, useState } from "react";
import { parseURL } from "@/lib/parseUrl";

export default function Home(): JSX.Element {
  const [selectedImage, setSelectedImage] = useState(
    "/no-image-placeholder.png",
  );
  const [queue, setQueue] = useState<string[]>([]);
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);

  const handleAddToQueue = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    const parsedURL = parseURL(url);
    if (parsedURL !== false) {
      const response = await fetch("/api/add-to-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: parsedURL }),
      });
      if (response.ok) {
        const responseData = await response.json();
        setQueue(responseData.queue);
        setUrl("");
      }
    }
  };

  const handleRemoveFromQueue = async (index: number): Promise<void> => {
    const response = await fetch("/api/remove-from-queue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    });
    if (response.ok) {
      const responseData = await response.json();
      setQueue(responseData.queue);
    }
  };

  const handleSetImage = (src: string): void => {
    setSelectedImage(`/${src}`);
  };

  useEffect(() => {
    const fetchQueue = async (): Promise<void> => {
      const response = await fetch("/api/get-queue");
      const data = await response.json();
      setQueue(data.queue);
    };

    const fetchResults = async (): Promise<void> => {
      const response = await fetch("/api/get-results");
      const data = await response.json();
      setResults(data.results);
    };

    const fetchStuff = async (): Promise<void> => {
      fetchQueue();
      fetchResults();
    };

    const intervalId = setInterval(fetchStuff, 2000);
    return (): void => clearInterval(intervalId);
  }, []);

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
