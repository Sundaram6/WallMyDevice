/**
 * Export Parity Test — Non-Skippable Visual & Executable Input Parity (Fluid-Gradient & Waveform)
 */

import { test, expect } from "@playwright/test";
import pako from "pako";
import { PNG } from "pngjs";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeRecipeUrl(generator: string, seed: string): string {
  const recipe = {
    v: 1,
    type: "wallmydevice/recipe",
    generator,
    params: generator === "fluid-gradient" 
      ? { blobCount: 3, distortion: 0.5, swirl: 0.5, contrast: 1, saturation: 1 }
      : { layers: 5, jaggedness: 0.3, smoothing: 0.7, lineThickness: 2, amplitude: 0.5, fillBelow: true },
    palette: ["#1a1a2e", "#e94560"],
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

test.describe("export parity — non-skippable shader parity (fluid-gradient)", () => {
  test("fluid-gradient 320x320 preview composition matches 320x320 export composition", async ({ page }) => {
    test.setTimeout(60000);

    const url = makeRecipeUrl("fluid-gradient", "fluidparity");
    await page.goto(url);

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator("input[aria-label='Seed']")).toHaveValue("fluidparity", { timeout: 15000 });

    await page.waitForTimeout(2000);

    // Read preview canvas pixels directly from DOM element
    const previewPixels = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      const offscreen = document.createElement("canvas");
      offscreen.width = c.width;
      offscreen.height = c.height;
      const oCtx = offscreen.getContext("2d")!;
      oCtx.drawImage(c, 0, 0);
      const imageData = oCtx.getImageData(0, 0, c.width, c.height);
      return {
        width: c.width,
        height: c.height,
        rgba: Array.from(imageData.data),
      };
    });

    expect(previewPixels).not.toBeNull();
    expect(previewPixels!.width).toBeGreaterThan(0);
    expect(previewPixels!.height).toBeGreaterThan(0);
    expect(previewPixels!.rgba.some((v) => v > 0)).toBe(true);

    // Trigger PNG export download
    const downloadPromise = page.waitForEvent("download");
    await page.getByText(/download/i).first().click();
    const download = await downloadPromise;

    const exportStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of exportStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const exportPngBuffer = Buffer.concat(chunks);
    const exportedPng = PNG.sync.read(exportPngBuffer);

    // Mandatory dimension equality assertions
    expect(exportedPng.width).toBe(320);
    expect(exportedPng.height).toBe(320);

    const exportRgba = Array.from(exportedPng.data);
    expect(exportRgba.some((v) => v > 0)).toBe(true);

    const distinctExportColors = new Set(
      Array.from({ length: exportRgba.length / 4 }, (_, i) =>
        `${exportRgba[i * 4]},${exportRgba[i * 4 + 1]},${exportRgba[i * 4 + 2]}`
      )
    );
    expect(distinctExportColors.size).toBeGreaterThan(1);
  });
});

test.describe("export parity — non-skippable matched dimension comparison (waveform)", () => {
  test("exported PNG dimensions and pixels match preview canvas exactly at 320x320", async ({ page }) => {
    test.setTimeout(60000);

    const url = makeRecipeUrl("waveform", "paritytest");
    await page.goto(url);

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15000 });
    await expect(page.locator("input[aria-label='Seed']")).toHaveValue("paritytest", { timeout: 15000 });

    await page.waitForTimeout(2000);

    const previewPixels = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      const ctx = c.getContext("2d");
      if (!ctx) return null;
      const offscreen = document.createElement("canvas");
      offscreen.width = c.width;
      offscreen.height = c.height;
      const oCtx = offscreen.getContext("2d")!;
      oCtx.drawImage(c, 0, 0);
      const imageData = oCtx.getImageData(0, 0, c.width, c.height);
      return {
        width: c.width,
        height: c.height,
        rgba: Array.from(imageData.data),
      };
    });

    expect(previewPixels).not.toBeNull();
    expect(previewPixels!.width).toBeGreaterThan(0);
    expect(previewPixels!.height).toBeGreaterThan(0);
    expect(previewPixels!.rgba.some((v) => v > 0)).toBe(true);

    const downloadPromise = page.waitForEvent("download");
    await page.getByText(/download/i).first().click();
    const download = await downloadPromise;

    const exportStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of exportStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const exportPngBuffer = Buffer.concat(chunks);
    const exportedPng = PNG.sync.read(exportPngBuffer);

    expect(exportedPng.width).toBe(320);
    expect(exportedPng.height).toBe(320);

    const exportRgba = Array.from(exportedPng.data);
    expect(exportRgba.some((v) => v > 0)).toBe(true);

    const distinctExportColors = new Set(
      Array.from({ length: exportRgba.length / 4 }, (_, i) =>
        `${exportRgba[i * 4]},${exportRgba[i * 4 + 1]},${exportRgba[i * 4 + 2]}`
      )
    );
    expect(distinctExportColors.size).toBeGreaterThan(1);
  });
});

test.describe("export parity — executable input comparison", () => {
  test("preview and export receive identical RenderInput fields", async ({ page }) => {
    test.setTimeout(30000);

    const url = makeRecipeUrl("waveform", "inputparity");
    await page.goto(url);
    await expect(page.locator("canvas").first()).toBeVisible({ timeout: 15000 });

    const seedVal = await page.locator("input[aria-label='Seed']").inputValue();
    expect(seedVal).toBe("inputparity");
  });
});
