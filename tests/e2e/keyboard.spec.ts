import { test, expect } from "@playwright/test";

test("R key randomizes the seed", async ({ page }) => {
  await page.goto("/");
  const seedBefore = await page.locator("input[aria-label='Seed']").inputValue();
  await page.keyboard.press("r");
  await page.waitForTimeout(100);
  const seedAfter = await page.locator("input[aria-label='Seed']").inputValue();
  expect(seedAfter).not.toBe(seedBefore);
});
