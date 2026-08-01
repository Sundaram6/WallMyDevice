import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  cellCount: z.number().min(10).max(150),
  borderThickness: z.number().min(0).max(10),
});

type Params = z.infer<typeof Schema>;

export const voronoiMosaic: Generator<Params> = {
  id: "voronoi-mosaic",
  label: "Voronoi Mosaic",
  category: "Geometric & Pattern",
  description: "Cellular tessellation mosaic with border outlines",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      cellCount: 40,
      borderThickness: 2,
    },
  },
  paramControls: [
    { key: "cellCount", label: "Cell Count", type: "slider", min: 10, max: 150, step: 5 },
    { key: "borderThickness", label: "Border Thickness", type: "slider", min: 0, max: 10, step: 1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    // Seed points
    const points: Array<{ x: number; y: number; color: string }> = [];
    for (let i = 0; i < params.cellCount; i++) {
      points.push({
        x: rng() * width,
        y: rng() * height,
        color: palette[i % palette.length],
      });
    }

    const refScale = Math.max(width, height) / 500;
    const step = Math.max(2, 4 * refScale);
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);
    const borderColor = palette[0] || "#101820";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = c * step;
        const py = r * step;

        let minDist1 = Infinity;
        let minDist2 = Infinity;
        let closestPoint = points[0];

        for (const pt of points) {
          const dist = Math.hypot(px - pt.x, py - pt.y);
          if (dist < minDist1) {
            minDist2 = minDist1;
            minDist1 = dist;
            closestPoint = pt;
          } else if (dist < minDist2) {
            minDist2 = dist;
          }
        }

        if (params.borderThickness > 0 && minDist2 - minDist1 < params.borderThickness * 2 * refScale) {
          ctx.fillStyle = borderColor;
        } else {
          ctx.fillStyle = closestPoint.color;
        }

        ctx.fillRect(px, py, step, step);
      }
    }
  },
};
