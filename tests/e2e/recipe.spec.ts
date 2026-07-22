import { test, expect } from "@playwright/test";
import pako from "pako";

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

test("recipe round-trip via URL hash", async ({ page }) => {
  const recipe = {
    v: 1,
    type: "wallmydevice/recipe",
    generator: "waveform",
    params: { layers: 3, jaggedness: 0.2, smoothing: 0.5, lineThickness: 1, amplitude: 0.4, fillBelow: true },
    palette: ["#123456", "#abcdef"],
    mode: "dark",
    seed: "testseed",
    grain: { enabled: false, intensity: 0 },
    blur: 0,
    resolution: { preset: "custom", width: 400, height: 600 },
    overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
  };
  const json = JSON.stringify(recipe);
  const deflated = pako.deflate(json);
  const encoded = toBase64Url(deflated);
  await page.goto("/#r=" + encoded);
  await expect(page.locator("input[aria-label='Seed']")).toHaveValue("testseed");
  await expect(page.getByText("waveform - 400x600")).toBeVisible();
});

test("updates recipe state dynamically on hashchange without page reload", async ({ page }) => {
  const recipe1 = {
    v: 1,
    type: "wallmydevice/recipe",
    generator: "waveform",
    params: { layers: 3, jaggedness: 0.2, smoothing: 0.5, lineThickness: 1, amplitude: 0.4, fillBelow: true },
    palette: ["#123456", "#abcdef"],
    mode: "dark",
    seed: "seed1111",
    grain: { enabled: false, intensity: 0 },
    blur: 0,
    resolution: { preset: "custom", width: 400, height: 600 },
    overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
  };

  const recipe2 = {
    ...recipe1,
    seed: "seed2222",
  };

  const hash1 = toBase64Url(pako.deflate(JSON.stringify(recipe1)));
  const hash2 = toBase64Url(pako.deflate(JSON.stringify(recipe2)));

  await page.goto("/#r=" + hash1);
  await expect(page.locator("input[aria-label='Seed']")).toHaveValue("seed1111");

  // Dynamically change location hash without full navigation reload
  await page.evaluate((h) => { window.location.hash = "#r=" + h; }, hash2);
  await expect(page.locator("input[aria-label='Seed']")).toHaveValue("seed2222");
});
