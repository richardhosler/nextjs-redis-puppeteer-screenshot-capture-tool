import { screenshot } from "@/lib/screenshot";
import JobProcessor from "@/lib/job-processor";
import { getRedisClient, RedisKeys } from "@/lib/redis";

let jobProcessor: JobProcessor | null = null;

export async function POST(req: Request): Promise<Response> {
  try {
    const redis = await getRedisClient();
    const { url } = await req.json();

    if (url && url.trim() !== "") {
      await redis.lPush(RedisKeys.QUEUE, url);
    }

    const updatedQueue = await redis.lRange(RedisKeys.QUEUE, 0, -1);

    if (!jobProcessor) {
      jobProcessor = new JobProcessor(RedisKeys.QUEUE, async (jobData) => {
        await screenshot(jobData);
      });
    }

    jobProcessor.start();

    return new Response(
      JSON.stringify({ success: true, queue: updatedQueue }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal Server Error: " + error,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
