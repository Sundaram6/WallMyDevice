import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  gridDensity: z.number().min(6).max(30),
  displacement: z.number().min(0.1).max(2),
});

type Params = z.infer<typeof Schema>;

export const lowpolyTerrain: Generator<Params> = {
  id: "lowpoly-terrain",
  label: "Low-Poly Terrain",
  category: "Geometric & Pattern",
  description: "Faceted triangulated mesh landscape grid",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      gridDensity: 14,
      displacement: 0.8,
    },
  },
  paramControls: [
    { key: "gridDensity", label: "Facet Mesh Density", type: "slider", min: 6, max: 30, step: 2 },
    { key: "displacement", label: "Height Displacement", type: "slider", min: 0.1, max: 2, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const cols = params.gridDensity;
    const rows = Math.round(cols * (height / width));
    const cellW = width / cols;
    const cellH = height / rows;

    const vertices: Array<Array<{ x: number; y: number }>> = [];

    for (let r = 0; r <= rows; r++) {
      vertices[r] = [];
      for (let c = 0; c <= cols; c++) {
        const baseX = c * cellW;
        const baseY = r * cellH;

        if (r === 0 || r === rows || c === 0 || c === cols) {
          vertices[r][c] = { x: baseX, y: baseY };
        } else {
          const offsetX = (rng() - 0.5) * cellW * params.displacement;
          const offsetY = (rng() - 0.5) * cellH * params.displacement;
          vertices[r][c] = { x: baseX + offsetX, y: baseY + offsetY };
        }
      }
    }

    // Render triangulated mesh
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const p1 = vertices[r][c];
        const p2 = vertices[r][c + 1];
        const p3 = vertices[r + 1][c];
        const p4 = vertices[r + 1][c + 1];

        // Triangle 1
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = palette[Math.floor(rng() * palette.length)];
        ctx.fill();

        // Triangle 2
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = palette[Math.floor(rng() * palette.length)];
        ctx.fill();
      }
    }
  },
};
