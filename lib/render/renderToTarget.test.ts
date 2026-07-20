import { describe, it, expect } from "vitest";
import { renderToTarget } from "./renderToTarget";
import { waveform } from "../generators/waveform";
import { registerGenerator, _resetRegistryForTests } from "../generators/registry";
import { makeCanvas } from "../../tests/helpers/canvas";
import { CURATED_PALETTES } from "../palettes/data";

describe("renderToTarget", () => {
  it("renders the registered generator to the target", () => {
    _resetRegistryForTests();
    registerGenerator(waveform);
    const { canvas, ctx } = makeCanvas(200, 400);
    renderToTarget({ ctx, width: 200, height: 400, dpr: 1 }, {
      generatorId: "waveform",
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
      renderToTarget({ ctx, width: 100, height: 100, dpr: 1 }, {
        generatorId: "nonexistent",
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
});
