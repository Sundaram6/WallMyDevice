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
      waveform.render({ kind: "canvas2d", canvas, ctx, width: 200, height: 400, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders without throwing at 2000x4000 (resolution independence)", () => {
    const { canvas, ctx } = makeCanvas(2000, 4000);
    const params = waveform.schema.defaults;
    expect(() =>
      waveform.render({ kind: "canvas2d", canvas, ctx, width: 2000, height: 4000, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders deterministically with the same seed", () => {
    const { canvas: canvas1, ctx: ctx1 } = makeCanvas(100, 100);
    const { canvas: canvas2, ctx: ctx2 } = makeCanvas(100, 100);
    const params = waveform.schema.defaults;
    waveform.render({ kind: "canvas2d", canvas: canvas1, ctx: ctx1, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ kind: "canvas2d", canvas: canvas2, ctx: ctx2, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const a = ctx1.getImageData(0, 0, 100, 100).data;
    const b = ctx2.getImageData(0, 0, 100, 100).data;
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("produces different output for different seeds", () => {
    const { canvas: canvas1, ctx: ctx1 } = makeCanvas(200, 200);
    const { canvas: canvas2, ctx: ctx2 } = makeCanvas(200, 200);
    const params = waveform.schema.defaults;
    waveform.render({ kind: "canvas2d", canvas: canvas1, ctx: ctx1, width: 200, height: 200, dpr: 1 }, params, "seed-A", ["#000", "#fff"], createRng("seed-A"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ kind: "canvas2d", canvas: canvas2, ctx: ctx2, width: 200, height: 200, dpr: 1 }, params, "seed-B", ["#000", "#fff"], createRng("seed-B"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const events1 = JSON.stringify((ctx1 as unknown as Record<string, () => unknown[]>).__getEvents());
    const events2 = JSON.stringify((ctx2 as unknown as Record<string, () => unknown[]>).__getEvents());
    expect(events1).not.toEqual(events2);
  });

  describe("continuous smoothing slider", () => {
    function getEventsForSmoothing(smoothVal: number) {
      const { canvas, ctx } = makeCanvas(200, 200);
      const params = { ...waveform.schema.defaults, smoothing: smoothVal, layers: 1, fillBelow: false };
      waveform.render(
        { kind: "canvas2d", canvas, ctx, width: 200, height: 200, dpr: 1 },
        params,
        "smooth-seed",
        ["#000", "#fff"],
        createRng("smooth-seed"),
        { blur: 0, grain: { enabled: false, intensity: 0 } }
      );
      return (ctx as unknown as { __getEvents: () => Array<{ type: string }> }).__getEvents();
    }

    it("smoothing = 0 follows the unsmoothed path (lineTo)", () => {
      const events = getEventsForSmoothing(0);
      const calls = events.map((e) => e.type);
      expect(calls).toContain("lineTo");
      expect(calls).not.toContain("quadraticCurveTo");
    });

    it("smoothing = 0.1 differs from smoothing = 0", () => {
      const events0 = JSON.stringify(getEventsForSmoothing(0));
      const events01 = JSON.stringify(getEventsForSmoothing(0.1));
      expect(events01).not.toEqual(events0);
    });

    it("smoothing = 0.5 differs from smoothing = 0.1", () => {
      const events01 = JSON.stringify(getEventsForSmoothing(0.1));
      const events05 = JSON.stringify(getEventsForSmoothing(0.5));
      expect(events05).not.toEqual(events01);
    });

    it("smoothing = 1 differs from smoothing = 0.5", () => {
      const events05 = JSON.stringify(getEventsForSmoothing(0.5));
      const events1 = JSON.stringify(getEventsForSmoothing(1));
      expect(events1).not.toEqual(events05);
    });

    it("repeating the same seed and smoothing produces identical drawing commands", () => {
      const e1 = JSON.stringify(getEventsForSmoothing(0.7));
      const e2 = JSON.stringify(getEventsForSmoothing(0.7));
      expect(e1).toBe(e2);
    });

    it("consistently validates parameter schema for smoothing bounds", () => {
      expect(waveform.schema.zod.safeParse({ ...waveform.schema.defaults, smoothing: 0 }).success).toBe(true);
      expect(waveform.schema.zod.safeParse({ ...waveform.schema.defaults, smoothing: 0.5 }).success).toBe(true);
      expect(waveform.schema.zod.safeParse({ ...waveform.schema.defaults, smoothing: 1 }).success).toBe(true);
      expect(waveform.schema.zod.safeParse({ ...waveform.schema.defaults, smoothing: -0.1 }).success).toBe(false);
      expect(waveform.schema.zod.safeParse({ ...waveform.schema.defaults, smoothing: 1.1 }).success).toBe(false);
    });
  });
});
