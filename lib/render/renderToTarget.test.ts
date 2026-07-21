import { describe, it, expect } from "vitest";
import { renderToTarget, resolvePalette, buildRenderInput } from "./renderToTarget";
import { waveform } from "../generators/waveform";
import { registerGenerator } from "../generators/registry";
import { makeCanvas } from "../../tests/helpers/canvas";
import { CURATED_PALETTES } from "../palettes/data";
import { randomUUID } from "node:crypto";

function uniqueWaveform() {
  return { ...waveform, id: `waveform-rtt-${randomUUID()}` };
}

const baseState = {
  generatorId: "waveform",
  params: { waveform: waveform.schema.defaults },
  palette: ["#0f172a", "#64748b", "#fafafa"],
  mode: "dark" as const,
  seed: "testseed",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
  overlayClock: false,
  overlayDate: false,
  overlayText: false,
  overlayTextValue: "",
  overlayFont: "Inter",
  overlaySize: 1,
};

describe("renderToTarget", () => {
  it("renders the registered generator to the target", () => {
    const gen = uniqueWaveform();
    registerGenerator(gen);
    const { canvas, ctx } = makeCanvas(200, 400);
    renderToTarget({ kind: "canvas2d", canvas, ctx, width: 200, height: 400, dpr: 1 }, {
      generatorId: gen.id,
      params: waveform.schema.defaults,
      palette: CURATED_PALETTES[0].colors,
      mode: "dark",
      seed: "test",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    });
    const drawCalls = (ctx as unknown as Record<string, () => unknown[]>).__getDrawCalls();
    expect(drawCalls.length).toBeGreaterThan(0);
  });

  it("throws a user-readable error for an unknown generator", () => {
    const { canvas, ctx } = makeCanvas(100, 100);
    expect(() =>
      renderToTarget({ kind: "canvas2d", canvas, ctx, width: 100, height: 100, dpr: 1 }, {
        generatorId: "nonexistent-" + randomUUID(),
        params: {},
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      })
    ).toThrow(/unknown generator/i);
  });

  describe("resolvePalette mode resolution", () => {
    const raw = ["#0f172a", "#64748b", "#fafafa"];

    it("places the darkest color first in Dark mode", () => {
      const dark = resolvePalette(raw, "dark");
      expect(dark[0]).toBe("#0f172a");
    });

    it("places the lightest color first in Light mode", () => {
      const light = resolvePalette(raw, "light");
      expect(light[0]).toBe("#fafafa");
    });

    it("resolves Light and Dark modes differently for mixed palettes", () => {
      const light = resolvePalette(raw, "light");
      const dark = resolvePalette(raw, "dark");
      expect(light[0]).not.toBe(dark[0]);
    });

    it("resolves Auto-dark to equal Dark mode", () => {
      const autoDark = resolvePalette(raw, "auto", "dark");
      const dark = resolvePalette(raw, "dark");
      expect(autoDark).toEqual(dark);
    });

    it("resolves Auto-light to equal Light mode", () => {
      const autoLight = resolvePalette(raw, "auto", "light");
      const light = resolvePalette(raw, "light");
      expect(autoLight).toEqual(light);
    });

    it("does not mutate the input raw palette array", () => {
      const original = ["#0f172a", "#64748b", "#fafafa"];
      const originalCopy = [...original];
      resolvePalette(original, "light");
      expect(original).toEqual(originalCopy);
    });

    it("returns empty palettes unchanged", () => {
      expect(resolvePalette([], "light")).toEqual([]);
    });

    it("returns deterministic results for repeated calls", () => {
      const first = resolvePalette(raw, "dark");
      const second = resolvePalette(raw, "dark");
      expect(first).toEqual(second);
    });
  });

  describe("buildRenderInput", () => {
    it("includes the effective system color scheme as autoMode", () => {
      const input = buildRenderInput(
        { ...baseState, mode: "auto", systemColorScheme: "light" },
        { width: 800, height: 600 }
      );
      expect(input.autoMode).toBe("light");
    });

    it("defaults autoMode to dark when systemColorScheme is omitted", () => {
      const input = buildRenderInput(baseState, { width: 800, height: 600 });
      expect(input.autoMode).toBe("dark");
    });
  });
});
