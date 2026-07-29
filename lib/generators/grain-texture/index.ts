import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  grainIntensity: z.number().min(0.05).max(0.5),
  gradientAngle: z.number().min(0).max(360),
});

type Params = z.infer<typeof Schema>;

export const grainTexture: Generator<Params> = {
  id: "grain-texture",
  label: "Grain & Film Texture",
  category: "Noise & Texture",
  description: "Fine analog film noise composited over gradient base",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      grainIntensity: 0.18,
      gradientAngle: 45,
    },
  },
  paramControls: [
    { key: "grainIntensity", label: "Grain Noise Strength", type: "slider", min: 0.05, max: 0.5, step: 0.01 },
    { key: "gradientAngle", label: "Gradient Angle", type: "slider", min: 0, max: 360, step: 15 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    // Render linear gradient background
    const rad = (params.gradientAngle * Math.PI) / 180;
    const x2 = width * Math.cos(rad);
    const y2 = height * Math.sin(rad);
    const grad = ctx.createLinearGradient(0, 0, Math.abs(x2), Math.abs(y2));

    palette.forEach((c, idx) => {
      grad.addColorStop(idx / (palette.length - 1 || 1), c);
    });

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Composite film grain noise
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const intensity = params.grainIntensity * 255;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (rng() - 0.5) * intensity;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }

    ctx.putImageData(imgData, 0, 0);
  },
};
