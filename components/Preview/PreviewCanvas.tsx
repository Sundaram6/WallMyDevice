import { useEffect, useRef, useState } from "react";
import { ensureRegistered } from "@/lib/generators";
import { getGenerator } from "@/lib/generators/registry";
import { renderToTarget, buildRenderInput, resolvePalette } from "@/lib/render/renderToTarget";
import { applyGrain } from "@/lib/render/grain";
import { drawOverlays } from "@/lib/render/overlays";
import { createRng } from "@/lib/prng";
import { useEditorStore } from "@/store/useEditorStore";
import type { FrameStyle } from "@/lib/devices/presets";
import type { Canvas2DTarget, WebGLTarget } from "@/lib/generators/types";

type Props = {
  frame: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame, aspect, maxWidth, maxHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const generatorId = useEditorStore(s => s.generatorId);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    setWebglError(false);
  }, [generatorId]);

  useEffect(() => {
    let raf = 0;
    const unsub = useEditorStore.subscribe(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        renderIfReady();
      });
    });
    renderIfReady();

    function renderIfReady() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const s = useEditorStore.getState();
      const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
      const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));

      const input = buildRenderInput(s, { width: w, height: h });
      const generator = getGenerator(s.generatorId);
      const needsWebGL = generator?.kind === "shader";

      try {
        if (needsWebGL) {
          // Offscreen WebGL canvas for base shader render
          let webglCanvas: HTMLCanvasElement | OffscreenCanvas;
          let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

          if (typeof OffscreenCanvas !== "undefined") {
            try {
              const offscreen = new OffscreenCanvas(w, h);
              gl = (offscreen.getContext("webgl", { preserveDrawingBuffer: true }) ||
                    offscreen.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                    (offscreen as any).getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
              if (gl) webglCanvas = offscreen;
              else {
                webglCanvas = document.createElement("canvas");
                webglCanvas.width = w;
                webglCanvas.height = h;
                gl = (webglCanvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                      webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                      webglCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
              }
            } catch {
              webglCanvas = document.createElement("canvas");
              webglCanvas.width = w;
              webglCanvas.height = h;
              gl = (webglCanvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                    webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                    webglCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
            }
          } else {
            webglCanvas = document.createElement("canvas");
            webglCanvas.width = w;
            webglCanvas.height = h;
            gl = (webglCanvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
                  webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                  webglCanvas.getContext("experimental-webgl", { preserveDrawingBuffer: true })) as WebGLRenderingContext | null;
          }

          if (!gl || !webglCanvas) {
            setWebglError(true);
            return;
          }

          const webglTarget: WebGLTarget = { kind: "webgl", canvas: webglCanvas, ctx: gl, width: w, height: h, dpr: 1 };
          const palette = resolvePalette(input.palette, input.mode, input.autoMode);
          const rng = createRng(input.seed);
          const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };

          // Stage 1: Render base WebGL shader
          generator?.render(webglTarget, input.params, input.seed, palette, rng, context);

          // Stage 2: Copy to DOM Canvas2D surface and apply blur, grain, overlays (Contract A)
          const ctx2d = canvas.getContext("2d");
          if (!ctx2d) return;
          canvas.width = w;
          canvas.height = h;

          if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
            (ctx2d as any).filter = `blur(${input.blurIntensity}px)`;
          }

          ctx2d.drawImage(webglCanvas as any, 0, 0);

          if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
            (ctx2d as any).filter = "none";
          }

          const domTarget: Canvas2DTarget = { kind: "canvas2d", canvas, ctx: ctx2d, width: w, height: h, dpr: 1 };

          if (input.grainEnabled && input.grainIntensity > 0) {
            applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
          }

          if (input.overlays) {
            drawOverlays(domTarget, input.overlays, palette);
          }
        } else {
          // Canvas2D generators
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = w;
          canvas.height = h;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          const target: Canvas2DTarget = { kind: "canvas2d", canvas, ctx, width: w, height: h, dpr: 1 };
          renderToTarget(target, input);
        }
        setWebglError(false);
      } catch (e) {
        console.error("PreviewCanvas error:", e);
        if (e instanceof Error && e.message.includes("WebGL")) {
          setWebglError(true);
        }
      }
    }
    return () => { unsub(); if (raf) cancelAnimationFrame(raf); };
  }, [generatorId, aspect, maxWidth, maxHeight]);

  if (webglError) {
    return (
      <div data-frame={frame} className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-zinc-400 text-center p-4">
          WebGL unavailable. Switch to a Canvas2D generator.
        </p>
      </div>
    );
  }

  return (
    <div data-frame={frame} className="flex h-full w-full items-center justify-center">
      <canvas key={generatorId} ref={canvasRef} className="block max-h-full max-w-full" />
    </div>
  );
}
