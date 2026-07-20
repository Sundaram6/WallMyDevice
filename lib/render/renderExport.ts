import { renderToTarget, type RenderInput } from "./renderToTarget";
import type { RenderTarget } from "../generators/types";

export async function renderExport(
  input: RenderInput,
  size: { width: number; height: number }
): Promise<OffscreenCanvas> {
  const canvas = new OffscreenCanvas(size.width, size.height);
  const ctx = canvas.getContext("2d")! as unknown as CanvasRenderingContext2D;
  const target: RenderTarget = { ctx, width: size.width, height: size.height, dpr: 1 };
  renderToTarget(target, input);
  return canvas;
}
