import { describe, it, expect } from "vitest";
import { encodeRecipe, decodeHash, encodeHash } from "./encode";
import { waveform } from "../generators/waveform";
import type { Recipe } from "./validate";

const sampleRecipe: Recipe = {
  v: 1,
  type: "wallmydevice/recipe",
  generator: "waveform",
  params: waveform.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark",
  seed: "k3p9x2a7",
  grain: { enabled: false, intensity: 0 },
  blur: 0,
  resolution: { preset: "desktop-1080p", width: 1920, height: 1080 },
  overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
};

describe("encodeRecipe / decodeHash roundtrip", () => {
  it("preserves all fields through encode->hash->decode", () => {
    const hash = encodeHash(sampleRecipe);
    const decoded = decodeHash(hash);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.recipe).toEqual(sampleRecipe);
    }
  });

  it("returns ok:false for malformed hash", () => {
    const r = decodeHash("#r=not-base64!@#");
    expect(r.ok).toBe(false);
  });

  it("returns ok:false for hash that decodes but does not validate", () => {
    const bad = "eyJ2IjoxLCJ0eXBlIjoid2FsbG15ZGV2aWNlL3JlY2lwZSJ9";
    const r = decodeHash("#r=" + bad);
    expect(r.ok).toBe(false);
  });

  it("encodeRecipe produces pretty-printed JSON", () => {
    const json = encodeRecipe(sampleRecipe);
    expect(json).toContain("\n");
    expect(JSON.parse(json)).toEqual(sampleRecipe);
  });
});