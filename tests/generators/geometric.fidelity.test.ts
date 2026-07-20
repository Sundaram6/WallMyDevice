import { describe, it, expect, beforeAll } from "vitest";
import { renderToTarget } from "../../lib/render/renderToTarget";
import { geometric } from "../../lib/generators/geometric";
import { registerGenerator } from "../../lib/generators/registry";
import { makeCanvas } from "../helpers/canvas";

beforeAll(() => {
  registerGenerator(geometric);
});

const input = {
  generatorId: "geometric",
  params: geometric.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark" as const,
  seed: "geofid",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

function downscale(src: ImageData, dw: number, dh: number): ImageData {
  const dst = new ImageData(dw, dh);
  for (let y = 0; y < dh; y++) {
    const sy = Math.floor((y / dh) * src.height);
    for (let x = 0; x < dw; x++) {
      const sx = Math.floor((x / dw) * src.width);
      const si = (sy * src.width + sx) * 4;
      const di = (y * dw + x) * 4;
      dst.data[di]     = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = 255;
    }
  }
  return dst;
}

describe("geometric fidelity", () => {
  it("preview matches downscale of export within tolerance", () => {
    const preview = makeCanvas(200, 400);
    const exportC = makeCanvas(2000, 4000);
    renderToTarget({ ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, input);
    renderToTarget({ ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, input);
    const pd = preview.ctx.getImageData(0, 0, 200, 400);
    const ed = exportC.ctx.getImageData(0, 0, 2000, 4000);
    const edDown = downscale(ed, 200, 400);
    let total = 0;
    for (let i = 0; i < pd.data.length; i += 4) {
      total += Math.abs(pd.data[i] - edDown.data[i])
            + Math.abs(pd.data[i + 1] - edDown.data[i + 1])
            + Math.abs(pd.data[i + 2] - edDown.data[i + 2]);
    }
    const mean = total / (pd.data.length / 4) / 3;
    expect(mean).toBeLessThan(2.55);
  });
});
