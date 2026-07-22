/**
 * WebGL Fallback and Generator Preview Recovery E2E Test
 */

import { test, expect, type Page } from "@playwright/test";

async function expectNonBlankCanvas(page: Page) {
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 10000 });
  const isNonBlank = await canvas.evaluate((c: HTMLCanvasElement) => {
    const ctx = c.getContext("2d");
    if (!ctx) return false;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    return data.some((byte) => byte !== 0);
  });
  expect(isNonBlank).toBe(true);
}

test.describe("WebGL fallback and generator preview recovery", () => {
  test("clears fallback state and renders nonblank canvas across repeated generator switching without page reload", async ({ page }) => {
    test.setTimeout(60000);

    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    // Mock WebGL context acquisition failure
    await page.addInitScript(() => {
      const originalCanvas = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: any[]) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          return null;
        }
        return originalCanvas.call(this, type, ...args);
      };
      if (typeof OffscreenCanvas !== "undefined") {
        const originalOffscreen = OffscreenCanvas.prototype.getContext;
        OffscreenCanvas.prototype.getContext = function (type: string, ...args: any[]) {
          if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
            return null;
          }
          return originalOffscreen.call(this, type, ...args);
        };
      }
    });

    // 1. Navigate to home page
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expectNonBlankCanvas(page);

    const fluidBtn = page.getByRole("button", { name: /fluid gradient/i });
    const waveformBtn = page.getByRole("button", { name: /waveform/i });
    const geometricBtn = page.getByRole("button", { name: /geometric/i });
    const typographyBtn = page.getByRole("button", { name: /typography/i });

    // 2. Select Fluid Gradient -> Fallback message MUST appear
    await fluidBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeVisible({ timeout: 15000 });

    // 3. Switch back to Waveform -> Fallback clears and nonblank canvas renders without reload
    await waveformBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 10000 });
    await expectNonBlankCanvas(page);

    // 4. Repeated switching sequence: fluid-gradient -> geometric -> typography -> waveform
    await fluidBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeVisible({ timeout: 5000 });

    await geometricBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 5000 });
    await expectNonBlankCanvas(page);

    await typographyBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 5000 });
    await expectNonBlankCanvas(page);

    await waveformBtn.click();
    await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 5000 });
    await expectNonBlankCanvas(page);

    expect(pageErrors).toEqual([]);
  });
});
