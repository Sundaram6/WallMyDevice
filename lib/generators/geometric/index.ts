import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  shape: z.enum(["triangles", "rects", "circles", "lines"]),
  gridSize: z.number().int().min(4).max(40),
  rotation: z.number().min(-1).max(1),
  strokeWidth: z.number().min(0).max(4),
  density: z.number().min(0).max(1),
  fillMode: z.enum(["fill", "stroke", "both"]),
});

type Params = z.infer<typeof Schema>;

function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: Params["shape"]) {
  ctx.beginPath();
  if (shape === "rects") {
    ctx.rect(x - size / 2, y - size / 2, size, size);
  } else if (shape === "circles") {
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  } else if (shape === "lines") {
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
  } else {
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.closePath();
  }
}

function svgShape(x: number, y: number, size: number, shape: Params["shape"]): string {
  if (shape === "rects") return `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" />`;
  if (shape === "circles") return `<circle cx="${x}" cy="${y}" r="${size / 2}" />`;
  if (shape === "lines") return `<line x1="${x - size / 2}" y1="${y - size / 2}" x2="${x + size / 2}" y2="${y + size / 2}" />`;
  const p1 = `${x},${y - size / 2}`;
  const p2 = `${x + size / 2},${y + size / 2}`;
  const p3 = `${x - size / 2},${y + size / 2}`;
  return `<polygon points="${p1} ${p2} ${p3}" />`;
}

export const geometric: Generator<Params> = {
  id: "geometric",
  label: "Geometric",
  description: "Grid pattern of geometric shapes",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { shape: "triangles", gridSize: 16, rotation: 0, strokeWidth: 1, density: 0.6, fillMode: "fill" },
  },
  supportsSvgExport: true,
  paramControls: [
    { key: "shape", label: "Shape", type: "select", options: [
      { value: "triangles", label: "Triangles" },
      { value: "rects", label: "Rectangles" },
      { value: "circles", label: "Circles" },
      { value: "lines", label: "Lines" },
    ]},
    { key: "gridSize", label: "Grid size", type: "slider", min: 4, max: 40, step: 1 },
    { key: "rotation", label: "Rotation", type: "slider", min: -1, max: 1, step: 0.01 },
    { key: "strokeWidth", label: "Stroke", type: "slider", min: 0, max: 4, step: 0.1 },
    { key: "density", label: "Density", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "fillMode", label: "Fill mode", type: "select", options: [
      { value: "fill", label: "Fill" },
      { value: "stroke", label: "Stroke" },
      { value: "both", label: "Both" },
    ]},
  ],
  render(target: RenderTarget, params: Params, seed: string, palette: string[], rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    ctx.fillStyle = palette[0] ?? "#000000";
    ctx.fillRect(0, 0, W, H);

    const cellW = W / params.gridSize;
    const cellH = H / params.gridSize;
    const size = Math.min(cellW, cellH) * 0.9;
    const angle = params.rotation * Math.PI;
    const accent = palette[palette.length - 1] ?? "#ffffff";

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    ctx.translate(-W / 2, -H / 2);
    ctx.lineWidth = params.strokeWidth;
    ctx.lineJoin = "round";

    for (let row = 0; row < params.gridSize; row++) {
      for (let col = 0; col < params.gridSize; col++) {
        if (rng() > params.density) continue;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const colorIdx = Math.min(palette.length - 1, 1 + Math.floor(rng() * (palette.length - 1)));
        ctx.fillStyle = palette[colorIdx] ?? accent;
        ctx.strokeStyle = palette[colorIdx] ?? accent;
        if (params.fillMode === "stroke") {
          drawShape(ctx, x, y, size, params.shape);
          ctx.stroke();
        } else if (params.fillMode === "fill") {
          drawShape(ctx, x, y, size, params.shape);
          ctx.fill();
        } else {
          drawShape(ctx, x, y, size, params.shape);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
  toSvg(size, params, seed, palette) {
    const cellW = size.width / params.gridSize;
    const cellH = size.height / params.gridSize;
    const shape = params.shape;
    const sizePx = Math.min(cellW, cellH) * 0.9;
    const colorCount = palette.length;
    const bg = palette[0] ?? "#000";
    const accent = palette[palette.length - 1] ?? "#fff";
    let shapes = "";
    let seedHash = 0;
    for (let i = 0; i < seed.length; i++) seedHash = (seedHash * 31 + seed.charCodeAt(i)) >>> 0;
    if (seedHash === 0) seedHash = 1;
    const rng = () => {
      seedHash = (seedHash + 0x6D2B79F5) >>> 0;
      let t = seedHash;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let row = 0; row < params.gridSize; row++) {
      for (let col = 0; col < params.gridSize; col++) {
        if (rng() > params.density) continue;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const colorIdx = Math.min(colorCount - 1, 1 + Math.floor(rng() * (colorCount - 1)));
        const fill = palette[colorIdx] ?? accent;
        const fillAttr = params.fillMode === "stroke" ? "none" : fill;
        const strokeAttr = params.fillMode === "fill" ? "none" : fill;
        shapes += `<g fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${params.strokeWidth}">${svgShape(x, y, sizePx, shape)}</g>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="${size.width}" height="${size.height}" fill="${bg}"/>${shapes}</svg>`;
  },
};
