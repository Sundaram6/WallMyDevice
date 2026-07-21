/**
 * Real E2E Fluid-Gradient Export Verification
 */

import { test, expect } from "@playwright/test";
import pako from "pako";
import { PNG } from "pngjs";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeFluidUrl(seed: string): string {
  const recipe = {
    v: 1,
    type: "wallmydevice/recipe",
    generator: "fluid-gradient",
    params: { blobCount: 3, distortion: 0.5, swirl: 0.5, contrast: 1, saturation: 1 },
    palette: ["#123456", "#654321"],
    mode: "dark",
    seed,
    grain: { enabled: false, intensity: 0 },
    blur: 0,
    resolution: { preset: "custom", width: 320, height: 320 },
    overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
  };
  const json = JSON.stringify(recipe);
  const deflated = pako.deflate(json);
  return "/#r=" + toBase64Url(deflated);
}

test.describe("fluid-gradient real browser export", () => {
  test("single PNG export produces valid, nonblank 320x320 image", async ({ page }) => {
    test.setTimeout(60000);

    const url = makeFluidUrl("exportseeda");
    await page.goto(url);

    // Record WebGL renderer info for trusted-test SwiftShader verification
    const rendererInfo = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return null;
      const ext = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      return ext ? (gl as WebGLRenderingContext).getParameter(ext.UNMASKED_RENDERER_WEBGL) : "renderer-info-unavailable";
    });
    console.log("[WEBGL RENDERER INFO]:", rendererInfo);

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator("input[aria-label='Seed']")).toHaveValue("exportseeda", { timeout: 15000 });

    await page.waitForTimeout(2000);

    // Trigger PNG export
    const downloadPromise = page.waitForEvent("download");
    await page.getByText(/download/i).first().click();
    const download = await downloadPromise;

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pngBuffer = Buffer.concat(chunks);
    const png = PNG.sync.read(pngBuffer);

    expect(png.width).toBe(320);
    expect(png.height).toBe(320);

    const rgba = Array.from(png.data);
    expect(rgba.some((v) => v > 0)).toBe(true);

    const distinctColors = new Set(
      Array.from({ length: rgba.length / 4 }, (_, i) => `${rgba[i * 4]},${rgba[i * 4 + 1]},${rgba[i * 4 + 2]}`)
    );
    expect(distinctColors.size).toBeGreaterThan(1);
  });

  test("seed A export differs from seed B export", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto(makeFluidUrl("seedaaaaa"));
    await page.waitForTimeout(2000);

    const downloadPromiseA = page.waitForEvent("download");
    await page.getByText(/download/i).first().click();
    const downloadA = await downloadPromiseA;
    const streamA = await downloadA.createReadStream();
    const chunksA: Buffer[] = [];
    for await (const chunk of streamA) chunksA.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const pngA = PNG.sync.read(Buffer.concat(chunksA));

    // Change seed to seed bbbbb
    const seedInput = page.locator("input[aria-label='Seed']");
    await seedInput.fill("seedbbbbb");
    await page.waitForTimeout(2000);

    const downloadPromiseB = page.waitForEvent("download");
    await page.getByText(/download/i).first().click();
    const downloadB = await downloadPromiseB;
    const streamB = await downloadB.createReadStream();
    const chunksB: Buffer[] = [];
    for await (const chunk of streamB) chunksB.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const pngB = PNG.sync.read(Buffer.concat(chunksB));

    expect(pngA.data.toString("base64")).not.toBe(pngB.data.toString("base64"));
  });
});
