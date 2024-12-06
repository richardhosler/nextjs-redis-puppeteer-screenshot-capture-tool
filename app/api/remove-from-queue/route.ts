import { getRedisClient, RedisKeys } from "@/lib/redis";

export async function POST(req: Request): Promise<Response> {
  const { index } = await req.json();
  try {
    const redis = await getRedisClient();
    redis.lSet("queue", parseInt(index), "--delete--");
    redis.lRem("queue", 0, "--delete--");
    const updatedQueue = await redis.lRange(RedisKeys.QUEUE, 0, -1);

    return new Response(JSON.stringify({ success: true, queue: updatedQueue }));
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
