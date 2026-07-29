import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  blobCount: z.number().min(3).max(20),
  threshold: z.number().min(0.2).max(1.5),
  blobSize: z.number().min(0.3).max(2),
});

type Params = z.infer<typeof Schema>;

export const metaballs: Generator<Params> = {
  id: "metaballs",
  label: "Metaballs",
  category: "Organic",
  description: "Soft fluid metaball blobs merging via implicit threshold",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      blobCount: 8,
      threshold: 0.7,
      blobSize: 1,
    },
  },
  paramControls: [
    { key: "blobCount", label: "Blob Count", type: "slider", min: 3, max: 20, step: 1 },
    { key: "threshold", label: "Merge Threshold", type: "slider", min: 0.2, max: 1.5, step: 0.1 },
    { key: "blobSize", label: "Blob Size Scale", type: "slider", min: 0.3, max: 2, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const bg = palette[0] || "#080711";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const blobColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;
    const minDim = Math.min(width, height);

    const blobs: Array<{ x: number; y: number; radius: number; color: string }> = [];
    for (let i = 0; i < params.blobCount; i++) {
      blobs.push({
        x: rng() * width,
        y: rng() * height,
        radius: minDim * 0.15 * (0.5 + rng() * 0.5) * params.blobSize,
        color: blobColors[i % blobColors.length],
      });
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    blobs.forEach((b) => {
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * params.threshold);
      grad.addColorStop(0, b.color);
      grad.addColorStop(0.7, b.color);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius * params.threshold, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  },
};
