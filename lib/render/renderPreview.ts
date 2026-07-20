import { renderToTarget, type RenderInput } from "./renderToTarget";
import type { RenderTarget } from "../generators/types";

export function renderPreview(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  input: RenderInput,
  size: { width: number; height: number; dpr: number } = { width: canvas.width, height: canvas.height, dpr: 1 }
): void {
  canvas.width = size.width * size.dpr;
  canvas.height = size.height * size.dpr;
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  const target: RenderTarget = { ctx, width: size.width, height: size.height, dpr: size.dpr };
  renderToTarget(target, input);
}
