import { describe, it, expect } from "vitest";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { createRng } from "../../lib/prng";

function makeWebGLCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: WebGLRenderingContext } | null {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl");
  if (!gl) return null;
  return { canvas, ctx: gl };
}

describe("fluid-gradient generator", () => {
  it("has registered id and label", () => {
    expect(fluidGradient.id).toBe("fluid-gradient");
    expect(fluidGradient.label).toBeTruthy();
    expect(fluidGradient.kind).toBe("shader");
  });

  it("renders without throwing when WebGL is available", () => {
    const w = makeWebGLCanvas(200, 400);
    if (!w) return;
    const params = fluidGradient.schema.defaults;
    expect(() =>
      fluidGradient.render({ kind: "webgl", canvas: w.canvas, ctx: w.ctx, width: 200, height: 400, dpr: 1 }, params, "fg", ["#000", "#fff"], createRng("fg"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders at multiple sizes", () => {
    for (const [w, h] of [[200, 400], [2000, 1000]] as const) {
      const webgl = makeWebGLCanvas(w, h);
      if (!webgl) return;
      const params = fluidGradient.schema.defaults;
      expect(() =>
        fluidGradient.render({ kind: "webgl", canvas: webgl.canvas, ctx: webgl.ctx, width: w, height: h, dpr: 1 }, params, "fg", ["#000", "#fff"], createRng("fg"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });
});
