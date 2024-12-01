interface SiteSubmitterProps {
  queue: string[];
  url: string;
  setUrl: (value: string) => void;
  handleRemoveFromQueue: (index: number) => Promise<void>;
  handleAddToQueue: (event: React.FormEvent) => void;
}

export const SiteSubmitter = ({
  queue,
  url,
  handleRemoveFromQueue,
  handleAddToQueue,
  setUrl,
}: SiteSubmitterProps): JSX.Element => {
  return (
    <div className="component">
      <form onSubmit={handleAddToQueue} className="submit-form">
        <input
          type="text"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Add to Queue</button>
      </form>

      <ul className="queue">
        {queue.map((item, index) => (
          <div key={index} className="justify">
            <li>{item}</li>
            <button
              onClick={() => {
                handleRemoveFromQueue(index);
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
