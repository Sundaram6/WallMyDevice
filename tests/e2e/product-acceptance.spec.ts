import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('Product Acceptance Tests', () => {
  test('verify core functionality and user actions end to end', async ({ page }) => {
    // Set higher timeout for the entire flow to prevent timeout aborts during file downloads
    test.setTimeout(60000);

    console.log("=== Loading Application ===");
    await page.goto('/');
    await page.waitForTimeout(2000);

    const getCanvasPixelSum = async () => {
      return await page.locator("canvas").first().evaluate((c: HTMLCanvasElement) => {
        const ctx = c.getContext("2d");
        if (!ctx) return 0;
        const data = ctx.getImageData(0, 0, c.width, c.height).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += data[i] + data[i+1] + data[i+2];
        }
        return sum;
      });
    };

    const getCanvasSize = async () => {
      return await page.locator("canvas").first().evaluate((c: HTMLCanvasElement) => {
        return { w: c.width, h: c.height };
      });
    };

    // 1. Initial Load and Waveform Controls
    console.log("Verifying initial load and Waveform Controls...");
    await page.getByRole("button", { name: "Open Workspace →" }).click();
    const canvasVisible = await page.locator("canvas").first().isVisible();
    expect(canvasVisible).toBe(true);

    const initialSum = await getCanvasPixelSum();
    expect(initialSum).toBeGreaterThan(0);

    const smoothingSlider = page.locator("input[type='range']").nth(2);
    await smoothingSlider.evaluate((el: HTMLInputElement, val) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, "0");
    await page.waitForTimeout(500);
    const sumAt0 = await getCanvasPixelSum();

    await smoothingSlider.evaluate((el: HTMLInputElement, val) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, "0.5");
    await page.waitForTimeout(500);
    const sumAt05 = await getCanvasPixelSum();

    await smoothingSlider.evaluate((el: HTMLInputElement, val) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, "1.0");
    await page.waitForTimeout(500);
    const sumAt1 = await getCanvasPixelSum();

    // Verify that changing smoothing actually updates pixels
    expect(sumAt0).not.toBe(sumAt05);
    expect(sumAt05).not.toBe(sumAt1);

    // 2. Select Fluid Gradient and modify distortion
    console.log("Verifying Fluid Gradient controls...");
    await page.click("button:has-text('Fluid Gradient')");
    await page.waitForTimeout(1000);
    const fluidSum = await getCanvasPixelSum();
    expect(fluidSum).toBeGreaterThan(0);

    const distortionSlider = page.locator("input[type='range']").nth(1);
    await distortionSlider.evaluate((el: HTMLInputElement, val) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, "1.8");
    await page.waitForTimeout(500);
    const fluidDistortedSum = await getCanvasPixelSum();
    expect(fluidSum).not.toBe(fluidDistortedSum);

    // 3. Switch generators sequence: Waveform -> Fluid Gradient -> Geometric -> Typography -> Waveform -> Fluid Gradient -> Waveform
    console.log("Verifying repeated generator switching sequence...");
    const sequence = ["Waveform", "Fluid Gradient", "Geometric", "Typography", "Waveform", "Fluid Gradient", "Waveform"];
    for (const genName of sequence) {
      await page.click(`button:has-text('${genName}')`);
      await page.waitForTimeout(500);
      const sum = await getCanvasPixelSum();
      expect(sum).toBeGreaterThan(0);
    }

    // 4. Palette and Mode Selection
    console.log("Verifying Palette & Mode changes...");
    const basePalSum = await getCanvasPixelSum();
    const paletteButtons = page.locator("button[aria-label*='Use ']");
    if (await paletteButtons.count() > 3) {
      await paletteButtons.nth(1).click();
      await page.waitForTimeout(300);
      const pal1Sum = await getCanvasPixelSum();
      expect(basePalSum).not.toBe(pal1Sum);
    }

    await page.click("button:has-text('Light')");
    await page.waitForTimeout(500);
    const lightSum = await getCanvasPixelSum();

    await page.click("button:has-text('Dark')");
    await page.waitForTimeout(500);
    const darkSum = await getCanvasPixelSum();
    expect(lightSum).not.toBe(darkSum);

    // 5. Device Preset and Custom Resolution
    console.log("Verifying resolution presets and custom sizing...");
    const presetSelect = page.locator("select[aria-label='Device preset']");
    await presetSelect.selectOption("iphone-15-pro");
    await page.waitForTimeout(500);
    const sizeIphone = await getCanvasSize();
    expect(sizeIphone.w).toBeGreaterThan(0);
    expect(sizeIphone.h).toBeGreaterThan(0);

    await presetSelect.selectOption("custom");
    await page.waitForTimeout(500);
    const customWidthInput = page.locator("input[aria-label='Width']");
    const customHeightInput = page.locator("input[aria-label='Height']");
    await customWidthInput.fill("640");
    await customHeightInput.fill("480");
    await page.waitForTimeout(500);
    const customSize = await getCanvasSize();
    expect(Math.abs((customSize.w / customSize.h) - (640 / 480))).toBeLessThan(0.01);

    // Empty input fallback
    await customWidthInput.fill("");
    await page.waitForTimeout(500);
    const sizeAfterEmpty = await getCanvasSize();
    expect(sizeAfterEmpty.w).toBeGreaterThan(0);
    expect(sizeAfterEmpty.h).toBeGreaterThan(0);

    // 6. Exports: PNG, JPG, WebP, SVG
    console.log("Verifying export functionality...");
    await page.click("button:has-text('Typography')");
    await page.waitForTimeout(500);

    const formats = ["png", "jpg", "webp", "svg"];
    const formatSelect = page.locator("select[aria-label='Export format']");
    const downloadButton = page.locator("button:has-text('Download')");

    for (const fmt of formats) {
      await formatSelect.selectOption(fmt);
      await page.waitForTimeout(300);
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        downloadButton.click()
      ]);
      const downloadPath = await download.path();
      expect(downloadPath).not.toBeNull();
      if (downloadPath) {
        const stats = fs.statSync(downloadPath);
        expect(stats.size).toBeGreaterThan(0);
        console.log(`Verified ${fmt.toUpperCase()} export: ${stats.size} bytes`);
      }
    }

    // 7. Batch Export
    console.log("Verifying Batch Export...");
    await page.click("button:has-text('Batch export')");
    await page.waitForTimeout(300);
    const [downloadZip] = await Promise.all([
      page.waitForEvent('download', { timeout: 20000 }),
      page.click("button:has-text('Generate all')")
    ]);
    const zipPath = await downloadZip.path();
    expect(zipPath).not.toBeNull();
    if (zipPath) {
      const statsZip = fs.statSync(zipPath);
      expect(statsZip.size).toBeGreaterThan(0);
      console.log(`Verified batch ZIP export: ${statsZip.size} bytes`);
    }

    // 8. Recipe hash url round-trip
    console.log("Verifying Recipe hash URL round-trip...");
    await page.locator("button[aria-pressed]").filter({ hasText: "Geometric" }).first().click();
    await page.waitForTimeout(500);
    const randBtn = page.locator("button[aria-label='Randomize seed']").first();
    await randBtn.click();
    await page.waitForTimeout(300);
    const customUrl = page.url();

    await page.locator("button[aria-pressed]").filter({ hasText: "Waveform" }).first().click();
    await page.waitForTimeout(300);

    await page.goto(customUrl);
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Open Workspace →" }).click();
    const recoveredSum = await getCanvasPixelSum();
    expect(recoveredSum).toBeGreaterThan(0);

    // 9. Seed Randomize
    console.log("Verifying Randomize...");
    const seedInput = page.locator("input[aria-label='Seed']").first();
    const initialSeed = await seedInput.inputValue();
    await page.locator("button[aria-label='Randomize seed']").first().click();
    await page.waitForTimeout(300);
    const newSeed = await seedInput.inputValue();
    expect(initialSeed).not.toBe(newSeed);

    // 10. Mobile UI viewport checks
    console.log("Verifying mobile layout viewport at 375x812...");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.click("button:has-text('Studio')");
    await page.waitForTimeout(500);
    const canvasMobileVisible = await page.locator("canvas").first().isVisible();
    expect(canvasMobileVisible).toBe(true);
    console.log("=== All core product acceptance flows validated successfully ===");
  });

  test('verify session restoration from localStorage on cold start', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Open Workspace →" }).click();

    // 1. Change seed and verify it's persisted
    const seedInput = page.locator("input[aria-label='Seed']").first();
    await seedInput.fill("localsessiontest");
    await seedInput.blur();
    await page.waitForTimeout(500);

    // 2. Open page again without hash and check if seed is restored
    await page.goto('/');
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Open Workspace →" }).click();
    const restoredSeed = await page.locator("input[aria-label='Seed']").first().inputValue();
    expect(restoredSeed).toBe("localsessiontest");
  });
});
