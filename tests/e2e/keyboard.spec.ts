import { test, expect } from "@playwright/test";

test("R key randomizes the seed", async ({ page }) => {
  await page.goto("/");
  // Wait for the app to fully initialize.
  await expect(page.locator("input[aria-label='Seed']")).toBeVisible();

  // Set a known seed value via the input so we have a deterministic baseline.
  const seedInput = page.locator("input[aria-label='Seed']");
  await seedInput.fill("aaaaaa");
  await seedInput.press("Enter");
  await page.waitForTimeout(100);
  const seedBefore = await seedInput.inputValue();
  expect(seedBefore).toBe("aaaaaa");

  // Ensure the document body has keyboard focus (not the input).
  await page.click("body");
  await page.waitForTimeout(50);

  await page.keyboard.press("r");
  await page.waitForTimeout(200);

  const seedAfter = await seedInput.inputValue();
  expect(seedAfter).not.toBe(seedBefore);
  // Also confirm the new seed is a valid base36 string.
  expect(seedAfter).toMatch(/^[0-9a-z]+$/);
});
