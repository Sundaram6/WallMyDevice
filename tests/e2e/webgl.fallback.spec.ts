/**
 * WebGL Fallback Recovery E2E Test
 */

import { test, expect } from "@playwright/test";

test.describe("WebGL fallback recovery", () => {
  test("clears fallback state when switching to Canvas2D and handles repeated generator toggling", async ({ page }) => {
    test.setTimeout(60000);

    // Deterministically mock WebGL context acquisition failure
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

    // 2. Click Fluid Gradient generator button (WebGL generator)
    const fluidBtn = page.getByRole("button", { name: /fluid gradient/i });
    if (await fluidBtn.isVisible()) {
      await fluidBtn.click();
    }

    // 3. Fallback message MUST appear
    await expect(page.getByText(/webgl unavailable/i)).toBeVisible({ timeout: 15000 });

    // 4. Switch back to Waveform (Canvas2D generator)
    const waveformBtn = page.getByRole("button", { name: /waveform/i });
    if (await waveformBtn.isVisible()) {
      await waveformBtn.click();
    }

    // 5. Fallback message MUST clear and Canvas2D canvas MUST render
    await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 10000 });
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // 6. Repeated toggling: waveform -> fluid-gradient -> waveform -> fluid-gradient
    if (await fluidBtn.isVisible() && await waveformBtn.isVisible()) {
      await fluidBtn.click();
      await expect(page.getByText(/webgl unavailable/i)).toBeVisible({ timeout: 5000 });

      await waveformBtn.click();
      await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 5000 });
      await expect(canvas).toBeVisible({ timeout: 5000 });
    }
  });
});
