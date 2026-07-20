import { describe, it, expect } from "vitest";
import { renderPreview } from "./renderPreview";
import { makeCanvas } from "../../tests/helpers/canvas";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";

describe("renderPreview", () => {
  it("sets the canvas pixel size to the requested size and renders", () => {
    ensureRegistered();
    const { canvas, ctx } = makeCanvas(200, 400);
    expect(canvas.width).toBe(200);
    renderPreview(canvas, ctx, {
      generatorId: "waveform",
      params: waveform.schema.defaults,
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "preview",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    });
    expect(canvas.width).toBe(200);
    const drawCalls = (ctx as unknown as Record<string, () => unknown[]>).__getDrawCalls();
    expect(drawCalls.length).toBeGreaterThan(0);
  });
});
