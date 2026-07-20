import { describe, it, expect } from "vitest";
import { renderToTarget } from "../../lib/render/renderToTarget";
import { waveform } from "../../lib/generators/waveform";
import { registerGenerator, _resetRegistryForTests } from "../../lib/generators/registry";
import { makeCanvas } from "../helpers/canvas";

const input = {
  generatorId: "waveform",
  params: waveform.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark" as const,
  seed: "fidelity",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

function downscale(src: ImageData, dw: number, dh: number): ImageData {
  const dst = new ImageData(dw, dh);
  const sw = src.width;
  const sh = src.height;
  for (let y = 0; y < dh; y++) {
    const sy = Math.floor((y / dh) * sh);
    for (let x = 0; x < dw; x++) {
      const sx = Math.floor((x / dw) * sw);
      const si = (sy * sw + sx) * 4;
      const di = (y * dw + x) * 4;
      dst.data[di]     = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = 255;
    }
  }
  return dst;
}

describe("waveform fidelity", () => {
  it("preview (200x400) matches downscale of export (2000x4000) within 1% mean diff", () => {
    _resetRegistryForTests();
    registerGenerator(waveform);
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
