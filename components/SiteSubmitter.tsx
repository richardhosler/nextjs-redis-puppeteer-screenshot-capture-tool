interface SiteSubmitterProps {
  queue: string[];
  url: string;
  setUrl: (value: string) => void;
  onHandleRemoveFromQueue: (index: number) => void;
  onHandleAddToQueue: (event: React.FormEvent) => void;
}

export const SiteSubmitter = ({
  queue,
  url,
  onHandleRemoveFromQueue,
  onHandleAddToQueue,
  setUrl,
}: SiteSubmitterProps): JSX.Element => {
  return (
    <div className="component">
      <h1>Job Queue</h1>
      <form onSubmit={onHandleAddToQueue} className="submit-form">
        <input
          type="text"
          placeholder="Website URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="submit">Add to Queue</button>
      </form>

      <ul className="queue">
        {queue.map((item, index) => (
          <div key={`job-queue-${index}`} className="justify">
            <li>{item}</li>
            <button
              onClick={() => {
                onHandleRemoveFromQueue(index);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};
