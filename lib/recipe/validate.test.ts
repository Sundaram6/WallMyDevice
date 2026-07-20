import { describe, it, expect } from "vitest";
import { parseRecipe, RecipeSchema } from "./validate";

describe("RecipeSchema", () => {
  it("accepts a minimal valid recipe", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform",
      params: { layers: 5, jaggedness: 0.4, smoothing: 0.7, lineThickness: 1.5, amplitude: 0.6, fillBelow: true },
      palette: ["#000000", "#ffffff"], mode: "dark", seed: "abc",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "desktop-1080p", width: 1920, height: 1080 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(true);
  });

  it("rejects unknown version", () => {
    const r = parseRecipe(JSON.stringify({ v: 99, type: "wallmydevice/recipe", generator: "waveform" }));
    expect(r.ok).toBe(false);
  });

  it("rejects wrong type", () => {
    const r = parseRecipe(JSON.stringify({ v: 1, type: "other/recipe", generator: "waveform" }));
    expect(r.ok).toBe(false);
  });

  it("rejects bad seed", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform", params: {},
      palette: ["#000", "#fff"], mode: "dark", seed: "!!!",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "x", width: 1, height: 1 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(false);
  });

  it("rejects invalid hex", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform", params: {},
      palette: ["zzz"], mode: "dark", seed: "a",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "x", width: 1, height: 1 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(false);
  });

  it("returns error for non-JSON", () => {
    const r = parseRecipe("not json");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/json/i);
  });
});

describe("RecipeSchema static", () => {
  it("is exported", () => {
    expect(RecipeSchema).toBeDefined();
  });
});
