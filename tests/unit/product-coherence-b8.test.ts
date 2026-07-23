import { describe, it, expect } from "vitest";
import { deriveFourVariations, buildPackManifest, PACK_PRESETS, LIVE_WALLPAPER_CAPABILITY_BOUNDARY } from "@/lib/export/variations";

describe("Product Coherence Pass - Batch 8 Unit Tests (Variations & Multi-Device Packs)", () => {
  it("derives four deterministic variation seeds for a given base seed and set index", () => {
    const seed1 = deriveFourVariations("bloom99", 0);
    const seed2 = deriveFourVariations("bloom99", 0);

    expect(seed1.length).toBe(4);
    expect(seed1).toEqual(seed2);
  });

  it("advances variation seeds predictably when set index increases", () => {
    const set0 = deriveFourVariations("bloom99", 0);
    const set1 = deriveFourVariations("bloom99", 1);

    expect(set0[0]).not.toEqual(set1[0]);
    expect(set1.length).toBe(4);
  });

  it("builds a multi-device pack JSON manifest with sizes, crop warnings, and seed metadata", () => {
    const manifestJson = buildPackManifest(
      { id: "terracotta-bloom", name: "Terracotta Bloom", seed: "bloom99", generatorId: "waveform" },
      PACK_PRESETS,
      "adaptive"
    );

    expect(typeof manifestJson).toBe("string");
    const parsed = JSON.parse(manifestJson);
    expect(parsed.app).toContain("WallMyDevice");
    expect(parsed.recipe.seed).toBe("bloom99");
    expect(parsed.exportedSizes.length).toBe(PACK_PRESETS.length);
  });

  it("documents live wallpaper future capability boundary without rendering non-functional CTAs", () => {
    expect(LIVE_WALLPAPER_CAPABILITY_BOUNDARY.animatedExportSupported).toBe(false);
    expect(LIVE_WALLPAPER_CAPABILITY_BOUNDARY.supportedFormats).toContain("zip_pack");
  });
});
