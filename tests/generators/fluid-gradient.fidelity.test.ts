import { describe, it, expect } from "vitest";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { createRng } from "../../lib/prng";

function makeWebGLCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl");
  if (!gl) return null;
  return { canvas, ctx: gl };
}

const input = {
  generatorId: "fluid-gradient",
  params: fluidGradient.schema.defaults,
  palette: ["#0f172a", "#f59e0b", "#fbbf24"],
  mode: "dark" as const,
  seed: "fgfid",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

describe("fluid-gradient fidelity", () => {
  it("renders at both preview and export sizes without throwing", () => {
    const preview = makeWebGLCanvas(200, 400);
    const exportC = makeWebGLCanvas(2000, 4000);
    if (!preview || !exportC) return;
    const params = fluidGradient.schema.defaults;
    const ctx1 = fluidGradient;
    expect(() => ctx1.render({ kind: "webgl", canvas: preview.canvas, ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, params, "fgfid", input.palette, createRng("fgfid"), { blur: 0, grain: { enabled: false, intensity: 0 } })).not.toThrow();
    expect(() => ctx1.render({ kind: "webgl", canvas: exportC.canvas, ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, params, "fgfid", input.palette, createRng("fgfid"), { blur: 0, grain: { enabled: false, intensity: 0 } })).not.toThrow();
  });
});
