/* eslint-disable no-console */
import { createClient } from "redis";

type JobProcessorFunction = (_jobData: string) => Promise<void>;

class JobProcessor {
  private redisClient;
  private redisListKey: string;
  private jobFunction: JobProcessorFunction;
  private isProcessing: boolean;

  constructor(redisListKey: string, jobFunction: JobProcessorFunction) {
    this.redisClient = createClient();
    this.redisListKey = redisListKey;
    this.jobFunction = jobFunction;
    this.isProcessing = false;

    this.redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    this.redisClient.connect().catch(console.error);
  }

  private async processNextJob(): Promise<void> {
    const jobData = await this.redisClient.lPop(this.redisListKey);
    if (jobData) {
      try {
        await this.jobFunction(jobData);
      } catch (err) {
        console.error(`Error processing job: ${jobData}`, err);
      }

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
