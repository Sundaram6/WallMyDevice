import { test, expect } from "@playwright/test";

test("R key randomizes the seed", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open Workspace →" }).click();
  await expect(page.locator("input[aria-label='Seed']")).toBeVisible();

  const seedInput = page.locator("input[aria-label='Seed']");
  await seedInput.fill("aaaaaa");
  await seedInput.press("Enter");
  await page.waitForTimeout(100);
  const seedBefore = await seedInput.inputValue();
  expect(seedBefore).toBe("aaaaaa");

  await page.click("body");
  await page.waitForTimeout(50);

  await page.keyboard.press("r");
  await page.waitForTimeout(200);

  const seedAfter = await seedInput.inputValue();
  expect(seedAfter).not.toBe(seedBefore);
  expect(seedAfter).toMatch(/^[0-9a-z]+$/);
});
