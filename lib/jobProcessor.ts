import { createClient } from "redis";

type JobProcessorFunction = (_jobData: string) => Promise<void>;

class JobProcessor {
  private redisClient;
  private redisListKey: string;
  private jobFunction: JobProcessorFunction;
  private isProcessing: boolean;

  constructor(redisListKey: string, jobFunction: JobProcessorFunction) {
    this.redisClient = createClient(); // Create Redis client
    this.redisListKey = redisListKey;
    this.jobFunction = jobFunction;
    this.isProcessing = false;

    // Handle connection errors
    this.redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    this.redisClient.connect().catch(console.error); // Ensure connection is established
  }

  private async processNextJob(): Promise<void> {
    const jobData = await this.redisClient.lPop(this.redisListKey); // Fetch the next job
    if (jobData) {
      try {
        await this.jobFunction(jobData); // Process the job
      } catch (err) {
        console.error(`Error processing job: ${jobData}`, err);
      }
      // Continue processing the next job
      await this.processNextJob();
    } else {
      this.isProcessing = false;
    }
  }

  public start(): void {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.processNextJob();
    }
  }

  public stop(): void {
    this.isProcessing = false;
  }
}

export default JobProcessor;
