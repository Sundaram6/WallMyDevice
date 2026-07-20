import { describe, it, expect } from "vitest";
import { geometric } from "../../lib/generators/geometric";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("geometric generator", () => {
  it("has registered id and supports SVG export", () => {
    expect(geometric.id).toBe("geometric");
    expect(geometric.supportsSvgExport).toBe(true);
  });

  it("renders at multiple sizes", () => {
    const params = geometric.schema.defaults;
    for (const [w, h] of [[100, 200], [2000, 1000], [600, 600]] as const) {
      const { canvas, ctx } = makeCanvas(w, h);
      expect(() =>
        geometric.render({ ctx, width: w, height: h, dpr: 1 }, params, "g", ["#000", "#fff"], createRng("g"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });

  it("toSvg returns a valid SVG string", () => {
    const svg = geometric.toSvg!({ width: 400, height: 800 }, geometric.schema.defaults, "svg", ["#000", "#fff"]);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });
});
