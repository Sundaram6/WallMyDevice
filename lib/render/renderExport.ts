import { renderToTarget, resolvePalette, type RenderInput } from "./renderToTarget";
import { getGenerator } from "../generators/registry";
import { createRng } from "../prng";
import { applyGrain } from "./grain";
import { drawOverlays } from "./overlays";
import type { Canvas2DTarget, WebGLTarget } from "../generators/types";

export type ExportTargetCanvas = OffscreenCanvas | HTMLCanvasElement;

export interface ShaderExportSession {
  render(input: RenderInput, size: { width: number; height: number }): Promise<ExportTargetCanvas>;
  dispose(): void;
}

export function createShaderExportSession(): ShaderExportSession {
  let activeGl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let activeCanvas: ExportTargetCanvas | null = null;

  return {
    async render(input: RenderInput, size: { width: number; height: number }): Promise<ExportTargetCanvas> {
      const generator = getGenerator(input.generatorId);
      if (!generator) throw new Error(`Unknown generator "${input.generatorId}"`);

      if (!activeGl || !activeCanvas || activeCanvas.width !== size.width || activeCanvas.height !== size.height) {
        if (typeof OffscreenCanvas !== "undefined") {
          try {
            const offscreen = new OffscreenCanvas(size.width, size.height);
            activeGl = (offscreen.getContext("webgl", { preserveDrawingBuffer: true }) ||
                        offscreen.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                        (offscreen as any).getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
            if (activeGl) activeCanvas = offscreen;
          } catch {
            // Fallback to DOM canvas
          }
        }

        if (!activeGl && typeof document !== "undefined") {
          const domCanvas = document.createElement("canvas");
          domCanvas.width = size.width;
          domCanvas.height = size.height;
          activeGl = (domCanvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                      domCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                      domCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
          if (activeGl) activeCanvas = domCanvas;
        }
      }

      if (!activeGl || !activeCanvas) {
        throw new Error(`WebGL context could not be acquired to export "${input.generatorId}".`);
      }

      const palette = resolvePalette(input.palette, input.mode, input.autoMode);
      const rng = createRng(input.seed);
      const context = {
        blur: input.blurIntensity,
        grain: { enabled: input.grainEnabled, intensity: input.grainIntensity },
      };

      const webglTarget: WebGLTarget = {
        kind: "webgl",
        canvas: activeCanvas,
        ctx: activeGl,
        width: size.width,
        height: size.height,
        dpr: 1,
      };

      generator.render(webglTarget, input.params, input.seed, palette, rng, context);

      let finalCanvas: ExportTargetCanvas;
      let finalCtx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

      if (typeof OffscreenCanvas !== "undefined") {
        try {
          const offscreen = new OffscreenCanvas(size.width, size.height);
          finalCtx = offscreen.getContext("2d");
          if (finalCtx) finalCanvas = offscreen;
          else {
            finalCanvas = document.createElement("canvas");
            (finalCanvas as HTMLCanvasElement).width = size.width;
            (finalCanvas as HTMLCanvasElement).height = size.height;
            finalCtx = (finalCanvas as HTMLCanvasElement).getContext("2d");
          }
        } catch {
          finalCanvas = document.createElement("canvas");
          (finalCanvas as HTMLCanvasElement).width = size.width;
          (finalCanvas as HTMLCanvasElement).height = size.height;
          finalCtx = (finalCanvas as HTMLCanvasElement).getContext("2d");
        }
      } else {
        finalCanvas = document.createElement("canvas");
        (finalCanvas as HTMLCanvasElement).width = size.width;
        (finalCanvas as HTMLCanvasElement).height = size.height;
        finalCtx = (finalCanvas as HTMLCanvasElement).getContext("2d");
      }

      if (!finalCtx) throw new Error("Canvas2D context could not be created for export composition.");

      if (input.blurIntensity > 0 && typeof (finalCtx as any).filter === "string") {
        (finalCtx as any).filter = `blur(${input.blurIntensity}px)`;
      }

      finalCtx.drawImage(activeCanvas as any, 0, 0);

      if (input.blurIntensity > 0 && typeof (finalCtx as any).filter === "string") {
        (finalCtx as any).filter = "none";
      }

      const finalTarget: Canvas2DTarget = {
        kind: "canvas2d",
        canvas: finalCanvas,
        ctx: finalCtx,
        width: size.width,
        height: size.height,
        dpr: 1,
      };

      if (input.grainEnabled && input.grainIntensity > 0) {
        applyGrain(finalTarget, input.grainIntensity, input.seed + "|grain");
      }

      if (input.overlays) {
        drawOverlays(finalTarget, input.overlays, palette);
      }

      return finalCanvas;
    },
    dispose() {
      if (activeGl) {
        const loseExt = activeGl.getExtension("WEBGL_lose_context");
        if (loseExt) loseExt.loseContext();
        activeGl = null;
        activeCanvas = null;
      }
    },
  };
}

export async function renderExport(
  input: RenderInput,
  size: { width: number; height: number }
): Promise<ExportTargetCanvas> {
  const generator = getGenerator(input.generatorId);
  if (!generator) throw new Error(`Unknown generator "${input.generatorId}"`);

  if (generator.kind === "shader") {
    const session = createShaderExportSession();
    try {
      return await session.render(input, size);
    } finally {
      session.dispose();
    }
  } else {
    let canvas: ExportTargetCanvas;
    let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

    if (typeof OffscreenCanvas !== "undefined") {
      try {
        const offscreen = new OffscreenCanvas(size.width, size.height);
        ctx = offscreen.getContext("2d");
        if (ctx) canvas = offscreen;
        else {
          canvas = document.createElement("canvas");
          (canvas as HTMLCanvasElement).width = size.width;
          (canvas as HTMLCanvasElement).height = size.height;
          ctx = (canvas as HTMLCanvasElement).getContext("2d");
        }
      } catch {
        canvas = document.createElement("canvas");
        (canvas as HTMLCanvasElement).width = size.width;
        (canvas as HTMLCanvasElement).height = size.height;
        ctx = (canvas as HTMLCanvasElement).getContext("2d");
      }
    } else {
      canvas = document.createElement("canvas");
      (canvas as HTMLCanvasElement).width = size.width;
      (canvas as HTMLCanvasElement).height = size.height;
      ctx = (canvas as HTMLCanvasElement).getContext("2d");
    }

    if (!ctx) throw new Error("Failed to acquire Canvas2D context for export.");

    const target: Canvas2DTarget = {
      kind: "canvas2d",
      canvas,
      ctx,
      width: size.width,
      height: size.height,
      dpr: 1,
    };

    renderToTarget(target, input);
    return canvas;
  }
}
