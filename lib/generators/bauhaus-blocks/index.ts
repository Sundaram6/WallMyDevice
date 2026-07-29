import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  shapeCount: z.number().min(8).max(50),
  gridSize: z.number().min(3).max(10),
});

type Params = z.infer<typeof Schema>;

export const bauhausBlocks: Generator<Params> = {
  id: "bauhaus-blocks",
  label: "Bauhaus Blocks",
  category: "Geometric & Pattern",
  description: "Constructivist flat-color circle, square and triangle compositions",
  kind: "canvas2d",
  supportsSvgExport: true,
  schema: {
    zod: Schema,
    defaults: {
      shapeCount: 20,
      gridSize: 5,
    },
  },
  paramControls: [
    { key: "shapeCount", label: "Shape Count", type: "slider", min: 8, max: 50, step: 2 },
    { key: "gridSize", label: "Grid Alignment", type: "slider", min: 3, max: 10, step: 1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const bg = palette[0] || "#FAF8F4";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const shapeColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;
    const cellW = width / params.gridSize;
    const cellH = height / params.gridSize;

    for (let i = 0; i < params.shapeCount; i++) {
      const gx = Math.floor(rng() * params.gridSize);
      const gy = Math.floor(rng() * params.gridSize);
      const x = gx * cellW;
      const y = gy * cellH;

      const color = shapeColors[Math.floor(rng() * shapeColors.length)];
      ctx.fillStyle = color;

      const shapeType = Math.floor(rng() * 3); // 0 = circle, 1 = rect, 2 = triangle

      if (shapeType === 0) {
        ctx.beginPath();
        ctx.arc(x + cellW / 2, y + cellH / 2, Math.min(cellW, cellH) / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (shapeType === 1) {
        ctx.fillRect(x, y, cellW, cellH);
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y + cellH);
        ctx.lineTo(x + cellW / 2, y);
        ctx.lineTo(x + cellW, y + cellH);
        ctx.closePath();
        ctx.fill();
      }
    }
  },
  toSvg(size, params, _seed, palette) {
    const { width, height } = size;
    const bg = palette[0] || "#FAF8F4";
    const shapeColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;
    const cellW = width / params.gridSize;
    const cellH = height / params.gridSize;

    let shapes = "";

    for (let i = 0; i < params.shapeCount; i++) {
      const gx = Math.floor((i * 17) % params.gridSize);
      const gy = Math.floor((i * 31) % params.gridSize);
      const x = gx * cellW;
      const y = gy * cellH;
      const color = shapeColors[i % shapeColors.length];

      const shapeType = i % 3;

      if (shapeType === 0) {
        shapes += `<circle cx="${x + cellW / 2}" cy="${y + cellH / 2}" r="${Math.min(cellW, cellH) / 2}" fill="${color}" />`;
      } else if (shapeType === 1) {
        shapes += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${color}" />`;
      } else {
        shapes += `<polygon points="${x},${y + cellH} ${x + cellW / 2},${y} ${x + cellW},${y + cellH}" fill="${color}" />`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${bg}" />${shapes}</svg>`;
  },
};
