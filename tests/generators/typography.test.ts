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
        typography.render({ kind: "canvas2d", canvas, ctx, width: w, height: h, dpr: 1 }, params, "t", ["#000", "#fff"], createRng("t"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });

  it("toSvg returns a valid SVG string", () => {
    const svg = typography.toSvg!({ width: 400, height: 800 }, typography.schema.defaults, "svg", ["#000", "#fff"]);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });

  it("maps left, center, right alignments to valid SVG text-anchor attributes", () => {
    const size = { width: 400, height: 800 };
    const palette = ["#000000", "#ffffff"];

    const svgLeft = typography.toSvg!(size, { ...typography.schema.defaults, alignment: "left" }, "s", palette);
    expect(svgLeft).toContain('text-anchor="start"');
    expect(svgLeft).not.toContain('text-anchor="left"');

    const svgCenter = typography.toSvg!(size, { ...typography.schema.defaults, alignment: "center" }, "s", palette);
    expect(svgCenter).toContain('text-anchor="middle"');
    expect(svgCenter).not.toContain('text-anchor="center"');

    const svgRight = typography.toSvg!(size, { ...typography.schema.defaults, alignment: "right" }, "s", palette);
    expect(svgRight).toContain('text-anchor="end"');
    expect(svgRight).not.toContain('text-anchor="right"');
  });
});
