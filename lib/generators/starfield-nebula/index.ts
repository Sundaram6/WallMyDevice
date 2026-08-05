import { z } from "zod";
import type { Generator } from "../types";
import { getPaletteByLuminance } from "../../palettes/contrast";

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

    // Intelligently select space background from darkest palette color or deep space base
    const { darkest, sorted, darkestLuminance } = getPaletteByLuminance(palette);
    const spaceBg = darkestLuminance <= 0.45 ? darkest : "#060913";

    ctx.fillStyle = spaceBg;
    ctx.fillRect(0, 0, width, height);

    // Use vibrant accent colors for nebula clouds
    const nebulaColors = sorted.filter((c) => c !== spaceBg);
    const cloudColors = nebulaColors.length > 0 ? nebulaColors : sorted;

    // Render soft nebula clouds with controlled blend opacity to prevent solid white blowout
    ctx.save();
    if (darkestLuminance <= 0.45) {
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.65;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.45;
    }

    const cloudCount = 4;
    const minDim = Math.min(width, height);

    for (let c = 0; c < cloudCount; c++) {
      const cx = rng() * width;
      const cy = rng() * height;
      const radius = minDim * (0.35 + rng() * 0.45);
      const color = cloudColors[c % cloudColors.length];

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

    // Render stars with high contrast against the background
    const baseSize = Math.max(1, minDim / 400);
    const isDarkBg = darkestLuminance <= 0.6;
    const starFillStyle = isDarkBg ? "rgba(255, 255, 255, " : "rgba(15, 23, 42, ";

    for (let s = 0; s < params.starDensity; s++) {
      const sx = rng() * width;
      const sy = rng() * height;
      const size = baseSize * (0.5 + rng() * 2) * params.twinkleFactor;
      const alpha = 0.35 + rng() * 0.65;

      ctx.fillStyle = `${starFillStyle}${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },
};
