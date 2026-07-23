import { useEffect, useRef, useState } from "react";
import { ensureRegistered } from "@/lib/generators";
import { getGenerator } from "@/lib/generators/registry";
import { renderToTarget, buildRenderInput, resolvePalette } from "@/lib/render/renderToTarget";
import { applyGrain } from "@/lib/render/grain";
import { drawOverlays } from "@/lib/render/overlays";
import { createRng } from "@/lib/prng";
import { useEditorStore } from "@/store/useEditorStore";
import type { Canvas2DTarget, WebGLTarget } from "@/lib/generators/types";

type Props = {
  width?: number;
  height?: number;
};

export function MiniPreviewCanvas({ width = 120, height = 180 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglError, setWebglError] = useState(false);

  const generatorId = useEditorStore(s => s.generatorId);
  const params = useEditorStore(s => s.params);
  const palette = useEditorStore(s => s.palette);
  const mode = useEditorStore(s => s.mode);
  const seed = useEditorStore(s => s.seed);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);

  const offscreenGlRef = useRef<{ canvas: HTMLCanvasElement | OffscreenCanvas; gl: WebGLRenderingContext; width: number; height: number } | null>(null);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const aspect = customWidth && customHeight ? customWidth / customHeight : 1;
    let targetW = width;
    let targetH = Math.round(width / aspect);
    if (targetH > height) {
      targetH = height;
      targetW = Math.round(height * aspect);
    }
    targetW = Math.max(20, targetW);
    targetH = Math.max(20, targetH);

    const s = useEditorStore.getState();
    const input = buildRenderInput(s, { width: targetW, height: targetH });
    const generator = getGenerator(s.generatorId);
    const needsWebGL = generator?.kind === "shader";

    try {
      if (needsWebGL) {
        let off = offscreenGlRef.current;
        if (!off || off.width !== targetW || off.height !== targetH) {
          let webglCanvas: HTMLCanvasElement | OffscreenCanvas | null = null;
          let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

          if (typeof OffscreenCanvas !== "undefined") {
            try {
              const offscreen = new OffscreenCanvas(targetW, targetH);
              gl = (offscreen.getContext("webgl", { preserveDrawingBuffer: true }) ||
                    offscreen.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                    (offscreen as any).getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
              if (gl) webglCanvas = offscreen;
            } catch {}
          }

          if (!gl && typeof document !== "undefined") {
            webglCanvas = document.createElement("canvas");
            webglCanvas.width = targetW;
            webglCanvas.height = targetH;
            gl = (webglCanvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                  webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                  webglCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
          }

          if (!gl || !webglCanvas) {
            setWebglError(true);
            return;
          }
          off = { canvas: webglCanvas, gl, width: targetW, height: targetH };
          offscreenGlRef.current = off;
        }

        const webglTarget: WebGLTarget = { kind: "webgl", canvas: off.canvas, ctx: off.gl, width: targetW, height: targetH, dpr: 1 };
        const resolvedPal = resolvePalette(input.palette, input.mode, input.autoMode);
        const rng = createRng(input.seed);
        const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };

        generator?.render(webglTarget, input.params, input.seed, resolvedPal, rng, context);

        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) return;
        canvas.width = targetW;
        canvas.height = targetH;
        ctx2d.drawImage(off.canvas as any, 0, 0);

        const domTarget: Canvas2DTarget = { kind: "canvas2d", canvas, ctx: ctx2d, width: targetW, height: targetH, dpr: 1 };
        if (input.grainEnabled && input.grainIntensity > 0) {
          applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
        }
        if (input.overlays) {
          drawOverlays(domTarget, input.overlays, resolvedPal);
        }
      } else {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const target: Canvas2DTarget = { kind: "canvas2d", canvas, ctx, width: targetW, height: targetH, dpr: 1 };
        renderToTarget(target, input);
      }
      setWebglError(false);
    } catch (e) {
      console.error("MiniPreviewCanvas error:", e);
      setWebglError(true);
    }
  }, [generatorId, params, palette, mode, seed, customWidth, customHeight, width, height]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-md border border-[#D4CDBC] bg-[#2B2A26] shadow-inner" style={{ width, height }}>
      <canvas ref={canvasRef} className={`block max-h-full max-w-full ${webglError ? "hidden" : ""}`} />
      {webglError && (
        <span className="text-[10px] text-zinc-400">Canvas2D</span>
      )}
    </div>
  );
}
