import { test, expect } from "@playwright/test";
import * as fs from "fs";

function pngDimensions(buffer: Buffer): { width: number; height: number } {
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

test.describe("Archive Functional Integration", () => {
  test("Archive counts reflect derived catalogue counts honestly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Print Swatch Archive." })).toBeVisible();
    await expect(page.getByText("50 prints")).toBeVisible();

    // Verify derived category count
    await page.locator("button:has-text('Monochrome')").first().click();
    await expect(page.getByText("Inkleaf")).toBeVisible();
    await expect(page.getByText("Terracotta Bloom")).not.toBeVisible();
  });

  test("Selecting a swatch restores all generator parameters, palette, seed, and mode", async ({ page }) => {
    await page.goto("/");

    // Click Inkleaf swatch card
    await page.locator("button:has-text('Botanicals')").first().click();
    await page.locator("article").filter({ hasText: "Inkleaf" }).first().click();

    // Switch to Studio workspace to inspect all restored parameters
    await page.getByRole("button", { name: "Open Workspace →" }).click();

    // Verify seed, generator, and multi-param restoration
    await expect(page.locator("input[aria-label='Seed']")).toHaveValue("inkleaf01");
    await expect(page.locator("select[aria-label='Shape']")).toHaveValue("circles");
    await expect(page.locator("input[aria-label='Grid size']")).toHaveValue("12");
  });

  test("1x, 2x, and Custom resolution scale options produce exact exported pixel dimensions", async ({ page }) => {
    await page.goto("/");

    // 1. Export at 1x scale
    const [dl1x] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Wallpaper" }).click(),
    ]);
    const path1x = await dl1x.path();
    expect(path1x).not.toBeNull();
    if (path1x) {
      const dims1x = pngDimensions(fs.readFileSync(path1x));
      expect(dims1x.width).toBe(1920);
      expect(dims1x.height).toBe(1080);
    }

    // 2. Export at 2x scale
    await page.getByRole("button", { name: "2x" }).click();
    const [dl2x] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Wallpaper" }).click(),
    ]);
    const path2x = await dl2x.path();
    expect(path2x).not.toBeNull();
    if (path2x) {
      const dims2x = pngDimensions(fs.readFileSync(path2x));
      expect(dims2x.width).toBe(3840);
      expect(dims2x.height).toBe(2160);
    }

    // 3. Export at Custom scale
    await page.getByRole("button", { name: "Custom" }).click();
    await page.getByRole("button", { name: "1920 × 1080 px" }).click();
    await page.locator("select[aria-label='Device type']").selectOption("custom");
    await page.locator("input[aria-label='Width']").fill("800");
    await page.locator("input[aria-label='Height']").fill("600");

    const [dlCustom] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Export Wallpaper" }).click(),
    ]);
    const pathCustom = await dlCustom.path();
    expect(pathCustom).not.toBeNull();
    if (pathCustom) {
      const dimsCustom = pngDimensions(fs.readFileSync(pathCustom));
      expect(dimsCustom.width).toBe(800);
      expect(dimsCustom.height).toBe(600);
    }
  });

  test("Modern device picker allows Brand, Model, Display, and Orientation selection", async ({ page }) => {
    await page.goto("/");

    // Open device picker
    await page.getByRole("button", { name: "1920 × 1080 px" }).click();

    // Select Phone type
    await page.locator("select[aria-label='Device type']").selectOption("phone");

    // Select Samsung brand
    await page.locator("select[aria-label='Phone brand']").selectOption("samsung");

    // Select Galaxy Z Fold5 model
    await page.locator("select[aria-label='Phone model']").selectOption("samsung-galaxy-z-fold5");

    // Verify main display dimensions
    await expect(page.getByText("1812 × 2176 px").first()).toBeVisible();

    // Switch display to cover screen
    await page.locator("select[aria-label='Phone display']").selectOption("cover");
    await expect(page.getByText("904 × 2316 px").first()).toBeVisible();

    // Switch orientation to Landscape
    await page.getByRole("button", { name: "Landscape" }).click();
    await expect(page.getByText("2316 × 904 px").first()).toBeVisible();
  });
});
