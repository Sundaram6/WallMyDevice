/**
 * Fluid Gradient Stability and Determinism Test
 *
 * This test exercises the fluid-gradient generator through the full browser
 * rendering pipeline using the chromium-webgl project (SwiftShader software
 * renderer). It verifies:
 *
 * 1. WebGL is available in the browser via SwiftShader.
 * 2. The PreviewCanvas correctly renders the fluid-gradient shader (no fallback error).
 * 3. The output is stable over time (no animation loop).
 * 4. The output changes between seeds (seed-derived uniforms work).
 * 5. The output is reproduced identically for the same seed (deterministic).
 *
 * If WebGL is unavailable or if the PreviewCanvas still shows the WebGL error,
 * the test FAILS explicitly — it cannot silently pass.
 */

import { test, expect } from "@playwright/test";
import { encodeHash } from "../../lib/recipe/encode";
import type { Recipe } from "../../lib/recipe/validate";

/**
 * Build a fluid-gradient recipe URL with a specific seed.
 * Uses visually distinct parameter combinations to ensure seeds produce
 * distinguishable renders:
 * - High distortion/swirl/contrast ensures visual variation per seed.
 * - High-contrast multi-color palette ensures non-blank rendering.
 * Seeds use only lowercase alphanumeric characters (max 16 chars) per
 * the recipe validation schema: /^[0-9a-z]{1,16}$/.
 */
function makeUrl(seed: string): string {
  const recipe: Recipe = {
    v: 1,
    type: "wallmydevice/recipe",
    generator: "fluid-gradient",
    params: { blobCount: 4, distortion: 1.5, swirl: 1.5, contrast: 3, saturation: 1.5 },
    palette: ["#000000", "#ff0000", "#00ff00", "#0000ff"],
    mode: "dark",
    seed,
    grain: { enabled: false, intensity: 0 },
    blur: 0,
    resolution: { preset: "custom", width: 400, height: 400 },
    overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
  };
  return "/" + encodeHash(recipe);
}

async function waitForFluidGradientCanvas(page: any) {
  // Wait for fluid-gradient to render: canvas must be visible and non-blank,
  // and the WebGL error must be hidden.
  await expect(page.getByText(/webgl unavailable/i)).toBeHidden({ timeout: 8000 });
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible({ timeout: 15000 });

  // Wait for the canvas to have non-zero dimensions.
  await expect.poll(async () => {
    const dims = await canvas.evaluate((el: HTMLCanvasElement) => ({
      width: el.width,
      height: el.height,
    }));
    return dims.width > 0 && dims.height > 0;
  }, { timeout: 10000, message: "canvas must have nonzero dimensions" }).toBe(true);

  // Allow OGL to flush its render to the canvas framebuffer.
  await page.waitForTimeout(1500);
  return canvas;
}

test.describe("fluid gradient idle stability and determinism", () => {
  test("runs all assertions — test MUST fail if WebGL or rendering is unavailable", async ({ page }) => {
    test.setTimeout(120000);

    page.on("console", msg => {
      console.log(`[BROWSER ${msg.type().toUpperCase()}]`, msg.text());
    });
    page.on("pageerror", err => {
      console.log("[BROWSER PAGE ERROR]", err);
    });

    // 1. Verify WebGL is available in the browser.
    const webglAvailableInBrowser = await page.evaluate(() => {
      const c = document.createElement("canvas");
      return Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
    });
    expect(
      webglAvailableInBrowser,
      "WebGL must be available via SwiftShader in chromium-webgl project"
    ).toBe(true);

    const urlA = makeUrl("aaa111aaa111aaa1");

    // 2. Load seed A, wait for render.
    await page.goto(urlA);
    const canvasA = await waitForFluidGradientCanvas(page);

    // 3. Verify seed input shows the expected seed.
    await expect(page.locator("input[aria-label='Seed']")).toHaveValue("aaa111aaa111aaa1", { timeout: 15000 });

    // 4. Capture stable screenshot A1 (give OGL render time to commit).
    await page.waitForTimeout(2000);
    const screenshotA1 = await canvasA.screenshot();
    expect(screenshotA1.byteLength).toBeGreaterThan(200);

    // 5. Wait 5 seconds and capture A2 — idle stability check.
    await page.waitForTimeout(5000);
    const screenshotA2 = await canvasA.screenshot();
    expect(
      screenshotA1.toString("base64"),
      "Same seed must produce identical output at T+0 and T+5s (no animation loop)"
    ).toEqual(screenshotA2.toString("base64"));

    // 6. Change seed to seed B via Seed input control.
    const seedInput = page.locator("input[aria-label='Seed']");
    await seedInput.fill("zzz999zzz999zzz9");
    await expect(seedInput).toHaveValue("zzz999zzz999zzz9");
    await page.waitForTimeout(2000);
    const screenshotB = await canvasA.screenshot();

    expect(
      screenshotA1.toString("base64"),
      "Different seeds must produce different outputs (seed-derived uniforms must differentiate render)"
    ).not.toEqual(screenshotB.toString("base64"));

    // 7. Change seed back to seed A (determinism check).
    await seedInput.fill("aaa111aaa111aaa1");
    await expect(seedInput).toHaveValue("aaa111aaa111aaa1");
    await page.waitForTimeout(2000);
    const screenshotA3 = await canvasA.screenshot();

    expect(
      screenshotA1.toString("base64"),
      "Same seed must reproduce identical output (determinism)"
    ).toEqual(screenshotA3.toString("base64"));
  });
});
