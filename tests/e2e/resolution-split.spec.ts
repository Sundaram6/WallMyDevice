import { test, expect } from "@playwright/test";

test.describe("Preview / Export Resolution Split", () => {
  test("desktop preview uses idle-desktop tier and drops to dragging tier during slider drag", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000/studio");
    await page.waitForLoadState("networkidle");

    const canvas = page.locator('[data-testid="preview-canvas"]');
    await expect(canvas).toBeVisible();

    // Verify initial idle-desktop tier
    await expect(canvas).toHaveAttribute("data-render-tier", "idle-desktop");
    const idleWidth = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
    const idleHeight = await canvas.evaluate((el: HTMLCanvasElement) => el.height);
    console.log(`[Resolution Tier - Desktop Idle] canvas.width: ${idleWidth}, canvas.height: ${idleHeight}`);
    expect(idleWidth).toBeGreaterThan(600);

    // Find a slider input (e.g. Waveform layers slider)
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();

    const box = await slider.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      // Start dragging slider
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(startX + 40, startY, { steps: 3 });

      // Verify canvas tier drops to 'dragging' while mouse is held down
      await expect(canvas).toHaveAttribute("data-render-tier", "dragging");
      const dragWidth = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
      const dragHeight = await canvas.evaluate((el: HTMLCanvasElement) => el.height);
      console.log(`[Resolution Tier - Slider Dragging] canvas.width: ${dragWidth}, canvas.height: ${dragHeight}`);
      expect(dragWidth).toBeLessThanOrEqual(380);

      // Release mouse
      await page.mouse.up();
      await page.waitForTimeout(300);

      // Verify canvas returns to idle-desktop tier
      await expect(canvas).toHaveAttribute("data-render-tier", "idle-desktop");
      const restoredWidth = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
      expect(restoredWidth).toBe(idleWidth);
    }
  });

  test("mobile preview uses idle-mobile tier", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://localhost:3000/studio");
    await page.waitForLoadState("networkidle");

    const canvas = page.locator('[data-testid="preview-canvas"]');
    await expect(canvas).toBeVisible();

    await expect(canvas).toHaveAttribute("data-render-tier", "idle-mobile");
    const mobileWidth = await canvas.evaluate((el: HTMLCanvasElement) => el.width);
    const mobileHeight = await canvas.evaluate((el: HTMLCanvasElement) => el.height);
    console.log(`[Resolution Tier - Mobile Idle] canvas.width: ${mobileWidth}, canvas.height: ${mobileHeight}`);
    expect(mobileWidth).toBeLessThanOrEqual(640);
    expect(mobileHeight).toBeLessThanOrEqual(640);
  });
});
