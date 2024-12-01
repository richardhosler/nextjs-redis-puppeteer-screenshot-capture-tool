"use server";
import puppeteer from "puppeteer";
import { getRedisClient, RedisKeys } from "./redis";

function sanitizeUrl(url: string): string {
  const output = url.replace(/https:\/\//, "");
  return output.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

export async function screenshot(url: string): Promise<void> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.waitForNetworkIdle().then(async () => {
    await page.screenshot({
      fullPage: true,
      path: `${process.env.IMAGE_PATH}${sanitizeUrl(url)}.png`,
      type: "png",
    });
  });
  page.close();

  const redis = await getRedisClient();
  redis.lPush(RedisKeys.RESULTS, `${sanitizeUrl(url)}.png`);
}
