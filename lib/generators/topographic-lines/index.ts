import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  contourCount: z.number().min(10).max(50),
  lineThickness: z.number().min(1).max(5),
  scale: z.number().min(0.001).max(0.008),
});

type Params = z.infer<typeof Schema>;

export const topographicLines: Generator<Params> = {
  id: "topographic-lines",
  label: "Topographic Lines",
  category: "Geometric & Pattern",
  description: "Elevation contour map lines generated from noise elevation",
  kind: "canvas2d",
  supportsSvgExport: true,
  schema: {
    zod: Schema,
    defaults: {
      contourCount: 24,
      lineThickness: 1.5,
      scale: 0.003,
    },
  },
  paramControls: [
    { key: "contourCount", label: "Contour Lines Count", type: "slider", min: 10, max: 50, step: 2 },
    { key: "lineThickness", label: "Line Thickness", type: "slider", min: 1, max: 5, step: 0.5 },
    { key: "scale", label: "Noise Elevation Scale", type: "slider", min: 0.001, max: 0.008, step: 0.0005 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const bg = palette[0] || "#FAF8F4";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const lineColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;
    const refScale = Math.max(width, height) / 500;
    ctx.lineWidth = params.lineThickness * refScale;

    const step = Math.max(2, 8 * refScale);
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    const seedOffset = rng() * 100;

    // Normalize coordinates to be resolution-independent.
    // Map pixel coords to a 1000px reference space based on the longer edge.
    const refSize = Math.max(width, height);
    const normScale = params.scale * 1000;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step;
        const y = r * step;

        const nx = (x / refSize) * 1000;
        const ny = (y / refSize) * 1000;

        const val = (Math.sin(nx * normScale + seedOffset) + Math.cos(ny * normScale + seedOffset) + 2) / 4;
        const contourLevel = Math.floor(val * params.contourCount);

        if (contourLevel % 2 === 0) {
          ctx.strokeStyle = lineColors[contourLevel % lineColors.length];
          ctx.strokeRect(x, y, step, step);
        }
      }
    }
  },
  toSvg(size, params, _seed, palette) {
    const { width, height } = size;
    const bg = palette[0] || "#FAF8F4";
    const lineColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;
    const refScaleSvg = Math.max(width, height) / 500;

    const step = Math.max(2, 12 * refScaleSvg);
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    let rects = "";

    const svgRefSize = Math.max(width, height);
    const svgNormScale = params.scale * 1000;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step;
        const y = r * step;

        const nx = (x / svgRefSize) * 1000;
        const ny = (y / svgRefSize) * 1000;

        const val = (Math.sin(nx * svgNormScale) + Math.cos(ny * svgNormScale) + 2) / 4;
        const contourLevel = Math.floor(val * params.contourCount);

        if (contourLevel % 2 === 0) {
          const color = lineColors[contourLevel % lineColors.length];
          rects += `<rect x="${x}" y="${y}" width="${step}" height="${step}" fill="none" stroke="${color}" stroke-width="${params.lineThickness * refScaleSvg}" />`;
        }
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}" />${rects}</svg>`;
  },
};
