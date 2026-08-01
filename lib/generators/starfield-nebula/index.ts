import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  starDensity: z.number().min(100).max(1500),
  nebulaGlow: z.number().min(0.2).max(1),
  twinkleFactor: z.number().min(0.1).max(1),
});

type Params = z.infer<typeof Schema>;

export const starfieldNebula: Generator<Params> = {
  id: "starfield-nebula",
  label: "Starfield / Nebula",
  category: "Cosmic",
  description: "Particle stars over soft gradient nebula cloud base",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      starDensity: 500,
      nebulaGlow: 0.7,
      twinkleFactor: 0.8,
    },
  },
  paramControls: [
    { key: "starDensity", label: "Star Density", type: "slider", min: 100, max: 1500, step: 50 },
    { key: "nebulaGlow", label: "Nebula Glow Strength", type: "slider", min: 0.2, max: 1, step: 0.05 },
    { key: "twinkleFactor", label: "Star Size Variation", type: "slider", min: 0.1, max: 1, step: 0.05 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const spaceBg = palette[0] || "#03001E";
    ctx.fillStyle = spaceBg;
    ctx.fillRect(0, 0, width, height);

    const nebulaColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;

    // Render soft nebula clouds
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const cloudCount = 4;
    const minDim = Math.min(width, height);

    for (let c = 0; c < cloudCount; c++) {
      const cx = rng() * width;
      const cy = rng() * height;
      const radius = minDim * (0.4 + rng() * 0.4);
      const color = nebulaColors[c % nebulaColors.length];

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * params.nebulaGlow);
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * params.nebulaGlow, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Render stars
    const baseSize = Math.max(1, minDim / 400);
    for (let s = 0; s < params.starDensity; s++) {
      const sx = rng() * width;
      const sy = rng() * height;
      const size = baseSize * (0.5 + rng() * 2) * params.twinkleFactor;
      const alpha = 0.3 + rng() * 0.7;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
