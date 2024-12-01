import { getRedisClient, RedisKeys } from "@/lib/redis";

export async function GET(): Promise<Response> {
  try {
    const redis = await getRedisClient();
    const results = await redis.lRange(RedisKeys.RESULTS, 0, -1);

    return new Response(JSON.stringify({ success: true, results: results }));
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
