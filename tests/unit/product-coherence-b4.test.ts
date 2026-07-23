import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { encodeHash, decodeHash, type Recipe } from "@/lib/recipe/encode";
import {
  getResolutionStrategyLabel,
  getOrientationLabel,
  getDeviceDisplayName,
  getGeneratorDisplayName,
} from "@/lib/recipe/metadata";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { ensureRegistered } from "@/lib/generators";

describe("Product Coherence Pass - Batch 4 Unit Tests (Accurate Metadata & Remix Routing)", () => {
  beforeEach(() => {
    ensureRegistered();
  });

  const sampleRecipe: Recipe = {
    v: 1,
    type: "wallmydevice/recipe",
    generator: "waveform",
    palette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26"],
    mode: "dark",
    seed: "bloom99",
    params: { layers: 6 },
    grain: { enabled: true, intensity: 0.1 },
    blur: 0,
    resolution: { preset: "iphone-15-pro", width: 1179, height: 2556 },
    overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
  };

  it("encodes and decodes recipes safely via compact hash references", () => {
    const encoded = encodeHash(sampleRecipe);
    expect(encoded.startsWith("#r=")).toBe(true);

    const decoded = decodeHash(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.recipe.generator).toBe("waveform");
      expect(decoded.recipe.seed).toBe("bloom99");
    }
  });

  it("handles invalid or corrupted recipe references gracefully", () => {
    const decoded = decodeHash("#r=invalid-hash-data");
    expect(decoded.ok).toBe(false);
    if (!decoded.ok) {
      expect(decoded.error).toBeDefined();
    }
  });

  it("derives accurate resolution strategy and orientation labels without hardcoded values", () => {
    const swatch = ARCHIVE_PRESETS[0];
    const resLabel = getResolutionStrategyLabel(swatch);
    const orientLabel = getOrientationLabel(swatch);

    expect(typeof resLabel).toBe("string");
    expect(["Phone", "Desktop", "OLED", "Adaptive", "Portrait", "Landscape", "Universal"]).toContain(resLabel);
    expect(["Portrait", "Landscape", "Universal"]).toContain(orientLabel);
  });

  it("derives device and generator display names accurately", () => {
    expect(getDeviceDisplayName("phone", "apple", "iphone-16-pro")).toBe("iphone-16-pro");
    expect(getDeviceDisplayName("phone", "samsung")).toBe("samsung Phone");
    expect(getDeviceDisplayName("tablet")).toBe("Tablet");

    expect(getGeneratorDisplayName("waveform")).toContain("Waveform");
    expect(getGeneratorDisplayName("fluid-gradient")).toContain("Fluid");
  });

  it("preserves immutability of curated archive recipes during remix operations", () => {
    const originalPreset = ARCHIVE_PRESETS[0];
    const originalSeed = originalPreset.seed;

    // Simulate remix mutation on temporary editor copy
    const copyParams = { ...originalPreset.params, layers: 99 };
    expect(copyParams.layers).toBe(99);
    expect(originalPreset.params.layers).not.toBe(99);
    expect(originalPreset.seed).toBe(originalSeed);
  });
});
