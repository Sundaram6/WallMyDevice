import type { RenderTarget } from "../generators/types";

export function applyGrain(target: RenderTarget, intensity: number, seed: string): void {
  if (target.kind !== "canvas2d" && typeof (target.ctx as any).getImageData !== "function") return;
  const ctx = target.ctx as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  const imageData = ctx.getImageData(0, 0, target.width, target.height);
  const d = imageData.data;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h === 0) h = 1;
  const range = Math.floor(intensity * 60);
  for (let i = 0; i < d.length; i += 4) {
    h = (h + 0x6D2B79F5) >>> 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const n = (((t ^ (t >>> 14)) >>> 0) / 4294967296 - 0.5) * range;
    d[i]     = Math.max(0, Math.min(255, d[i]     + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}
