import { describe, it, expect } from "vitest";
import { typography } from "../../lib/generators/typography";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("typography generator", () => {
  it("has registered id and supports SVG export", () => {
    expect(typography.id).toBe("typography");
    expect(typography.supportsSvgExport).toBe(true);
  });

  it("renders at multiple sizes", () => {
    const params = typography.schema.defaults;
    for (const [w, h] of [[400, 800], [2000, 1000]] as const) {
      const { canvas, ctx } = makeCanvas(w, h);
      expect(() =>
        typography.render({ ctx, width: w, height: h, dpr: 1 }, params, "t", ["#000", "#fff"], createRng("t"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });

  it("toSvg returns a valid SVG string", () => {
    const svg = typography.toSvg!({ width: 400, height: 800 }, typography.schema.defaults, "svg", ["#000", "#fff"]);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });
});
