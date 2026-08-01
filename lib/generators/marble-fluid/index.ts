import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  swirlIntensity: z.number().min(0.2).max(3),
  veinContrast: z.number().min(0.5).max(3),
  scale: z.number().min(0.001).max(0.008),
});

type Params = z.infer<typeof Schema>;

export const marbleFluid: Generator<Params> = {
  id: "marble-fluid",
  label: "Marble / Fluid Paint",
  category: "Noise & Texture",
  description: "Domain-warped fluid marble paint texture",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      swirlIntensity: 1.5,
      veinContrast: 1.8,
      scale: 0.003,
    },
  },
  paramControls: [
    { key: "swirlIntensity", label: "Swirl Warp Intensity", type: "slider", min: 0.2, max: 3, step: 0.1 },
    { key: "veinContrast", label: "Vein Contrast", type: "slider", min: 0.5, max: 3, step: 0.1 },
    { key: "scale", label: "Pattern Scale", type: "slider", min: 0.001, max: 0.008, step: 0.0005 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const refScale = Math.max(width, height) / 500;
    const step = Math.max(2, 4 * refScale);
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    const c1 = palette[0] || "#101820";
    const c2 = palette[1] || "#8A9A6E";
    const c3 = palette[2] || "#E4DCC8";

    // Simple pseudo noise warp
    const seedOffset = rng() * 100;

    // Normalize coordinates to be resolution-independent:
    // We map pixel coords to a [0, 1] UV space based on the LONGER edge,
    // then scale by a base reference of 1000px. This ensures the same visual
    // appearance at any canvas size (preview at 400px, export at 3000px).
    const refSize = Math.max(width, height);
    const normScale = params.scale * 1000;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step;
        const y = r * step;

        // Normalize to [0, refSize] space (resolution-independent)
        const nx = (x / refSize) * 1000;
        const ny = (y / refSize) * 1000;

        const qx = Math.sin(nx * normScale + seedOffset);
        const qy = Math.cos(ny * normScale + seedOffset);

        const warpX = nx + qx * 50 * params.swirlIntensity;
        const warpY = ny + qy * 50 * params.swirlIntensity;

        const val = Math.sin((warpX + warpY) * normScale * params.veinContrast);
        const norm = (val + 1) / 2;

        if (norm < 0.5) {
          ctx.fillStyle = c1;
        } else if (norm < 0.8) {
          ctx.fillStyle = c2;
        } else {
          ctx.fillStyle = c3;
        }

        ctx.fillRect(x, y, step, step);
      }
    }
  },
};
