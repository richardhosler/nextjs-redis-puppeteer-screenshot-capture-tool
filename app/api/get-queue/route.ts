import { getRedisClient, RedisKeys } from "@/lib/redis";

export async function GET(): Promise<Response> {
  try {
    const redis = await getRedisClient();
    const queue = await redis.lRange(RedisKeys.QUEUE, 0, -1);
    return new Response(JSON.stringify({ success: true, queue: queue }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
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
