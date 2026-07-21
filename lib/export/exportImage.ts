import { renderExport, type ExportTargetCanvas, type ShaderExportSession } from "../render/renderExport";
import { resolvePalette, type RenderInput } from "../render/renderToTarget";
import { validateExportSize } from "./limits";

export type ExportFormat = "png" | "jpg" | "webp";

async function canvasToBlob(
  canvas: ExportTargetCanvas,
  mime: string,
  quality?: number
): Promise<Blob> {
  if ("convertToBlob" in canvas && typeof (canvas as OffscreenCanvas).convertToBlob === "function") {
    return (canvas as OffscreenCanvas).convertToBlob({ type: mime, quality });
  }
  if ("toBlob" in canvas && typeof (canvas as HTMLCanvasElement).toBlob === "function") {
    return new Promise((resolve, reject) => {
      (canvas as HTMLCanvasElement).toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export image blob"))),
        mime,
        quality
      );
    });
  }
  throw new Error("Canvas blob conversion is not supported in this environment");
}

export async function exportImage(
  input: RenderInput,
  size: { width: number; height: number },
  format: ExportFormat = "png",
  options?: { shaderSession?: ShaderExportSession }
): Promise<Blob> {
  try {
    const validation = validateExportSize(size.width, size.height);
    if (!validation.ok) throw new Error(validation.error);
    
    let canvas: ExportTargetCanvas;
    if (options?.shaderSession) {
      canvas = await options.shaderSession.render(input, size);
    } else {
      canvas = await renderExport(input, size);
    }

    // Alpha flattening for JPEG format to ensure deterministic background color
    if (format === "jpg") {
      const palette = resolvePalette(input.palette, input.mode, input.autoMode);
      const bg = palette[0] ?? "#000000";

      let flatCanvas: ExportTargetCanvas;
      let flatCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

      if (typeof OffscreenCanvas !== "undefined") {
        try {
          const offscreen = new OffscreenCanvas(size.width, size.height);
          flatCtx = offscreen.getContext("2d");
          flatCanvas = offscreen;
        } catch {
          flatCanvas = document.createElement("canvas");
          (flatCanvas as HTMLCanvasElement).width = size.width;
          (flatCanvas as HTMLCanvasElement).height = size.height;
          flatCtx = (flatCanvas as HTMLCanvasElement).getContext("2d");
        }
      } else {
        flatCanvas = document.createElement("canvas");
        (flatCanvas as HTMLCanvasElement).width = size.width;
        (flatCanvas as HTMLCanvasElement).height = size.height;
        flatCtx = (flatCanvas as HTMLCanvasElement).getContext("2d");
      }

      if (flatCtx && typeof flatCtx.drawImage === "function") {
        try {
          flatCtx.fillStyle = bg;
          flatCtx.fillRect(0, 0, size.width, size.height);
          flatCtx.drawImage(canvas as any, 0, 0);
          canvas = flatCanvas;
        } catch {
          // In Node test environment, canvas remains intact if drawImage is mocked
        }
      }
    }

    const mime = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[format];
    const quality = format === "jpg" ? 0.92 : undefined;
    return await canvasToBlob(canvas, mime, quality);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("Failed to export image:")) throw err;
    throw new Error(`Failed to export image: ${msg}`);
  }
}
