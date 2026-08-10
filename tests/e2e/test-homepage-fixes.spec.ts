import { test, expect } from "@playwright/test";
import path from "path";

const QA_DIR = path.join(__dirname, "..", "..", "qa");

test.describe("Homepage Fixes", () => {
  test("Hero stat counters", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    // Take screenshot of the hero section
    await page.screenshot({ path: path.join(QA_DIR, "hero_stats.png"), clip: { x: 0, y: 0, width: 1280, height: 800 } });
  });

  test("Seasonal Drop Section", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    // Scroll to seasonal section
    const seasonal = page.locator('section:has-text("Seasonal")').first();
    await seasonal.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(QA_DIR, "seasonal_timer.png") });
  });

  test("Inline Studio embed", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    // Scroll to studio embed
    const studioEmbed = page.locator('#inline-studio-container').first();
    if (await studioEmbed.count() > 0) {
      await studioEmbed.scrollIntoViewIfNeeded();
    } else {
      await page.evaluate(() => window.scrollTo(0, 1500));
    }
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(QA_DIR, "inline_studio.png") });
  });

  test("About page character count", async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(QA_DIR, "about_page.png") });
  });
});
