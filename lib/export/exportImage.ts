import { renderExport } from "../render/renderExport";
import type { RenderInput } from "../render/renderToTarget";
import { validateExportSize } from "./limits";

export type ExportFormat = "png" | "jpg" | "webp";

export async function exportImage(
  input: RenderInput,
  size: { width: number; height: number },
  format: ExportFormat = "png"
): Promise<Blob> {
  const validation = validateExportSize(size.width, size.height);
  if (!validation.ok) throw new Error(validation.error);
  const canvas = await renderExport(input, size);
  const mime = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[format];
  const quality = format === "jpg" ? 0.92 : undefined;
  return canvas.convertToBlob({ type: mime, quality });
}
