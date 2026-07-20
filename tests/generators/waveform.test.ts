import { describe, it, expect } from "vitest";
import { waveform } from "../../lib/generators/waveform";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("waveform generator", () => {
  it("has a registered id and label", () => {
    expect(waveform.id).toBe("waveform");
    expect(waveform.label).toBeTruthy();
    expect(waveform.kind).toBe("canvas2d");
  });

  it("has at least 4 param controls", () => {
    expect(waveform.paramControls.length).toBeGreaterThanOrEqual(4);
  });

  it("defaults are valid per its own schema", () => {
    const result = waveform.schema.zod.safeParse(waveform.schema.defaults);
    expect(result.success).toBe(true);
  });

  it("renders without throwing at 200x400", () => {
    const { canvas, ctx } = makeCanvas(200, 400);
    const params = waveform.schema.defaults;
    expect(() =>
      waveform.render({ ctx, width: 200, height: 400, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders without throwing at 2000x4000 (resolution independence)", () => {
    const { canvas, ctx } = makeCanvas(2000, 4000);
    const params = waveform.schema.defaults;
    expect(() =>
      waveform.render({ ctx, width: 2000, height: 4000, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders deterministically with the same seed", () => {
    const { ctx: ctx1 } = makeCanvas(100, 100);
    const { ctx: ctx2 } = makeCanvas(100, 100);
    const params = waveform.schema.defaults;
    waveform.render({ ctx: ctx1, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ ctx: ctx2, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const a = ctx1.getImageData(0, 0, 100, 100).data;
    const b = ctx2.getImageData(0, 0, 100, 100).data;
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("produces different output for different seeds", () => {
    const { ctx: ctx1 } = makeCanvas(200, 200);
    const { ctx: ctx2 } = makeCanvas(200, 200);
    const params = waveform.schema.defaults;
    waveform.render({ ctx: ctx1, width: 200, height: 200, dpr: 1 }, params, "seed-A", ["#000", "#fff"], createRng("seed-A"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ ctx: ctx2, width: 200, height: 200, dpr: 1 }, params, "seed-B", ["#000", "#fff"], createRng("seed-B"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const events1 = JSON.stringify((ctx1 as unknown as Record<string, () => unknown[]>).__getEvents());
    const events2 = JSON.stringify((ctx2 as unknown as Record<string, () => unknown[]>).__getEvents());
    expect(events1).not.toEqual(events2);
  });
});
