import { test, expect } from "@playwright/test";

test("home page loads with a wallpaper", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "WallMyDevice" })).toBeVisible();
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
});
