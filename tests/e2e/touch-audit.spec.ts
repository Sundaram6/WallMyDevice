import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
});

test("Touch interaction & tap cycling audit on mobile viewport", async ({ page }) => {
  await page.goto("http://localhost:3000/studio");
  await page.waitForSelector('[data-testid="bottom-sheet"]');

  const sheet = page.locator('[data-testid="bottom-sheet"]');
  const handle = page.locator('[data-testid="sheet-handle"]');

  // Initial state: peek
  await expect(sheet).toHaveAttribute("data-snap", "peek");

  // Tap handle -> should cycle peek to control
  await handle.tap();
  await page.waitForTimeout(500);
  await expect(sheet).toHaveAttribute("data-snap", "control");

  // Tap handle again -> should cycle control to full
  await handle.tap();
  await page.waitForTimeout(500);
  await expect(sheet).toHaveAttribute("data-snap", "full");

  // Tap handle in full -> should return to control
  await handle.tap();
  await page.waitForTimeout(500);
  await expect(sheet).toHaveAttribute("data-snap", "control");
});
