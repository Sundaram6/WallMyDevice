import { useEffect, useRef, useState, useCallback } from "react";
import { ensureRegistered } from "@/lib/generators";
import { getGenerator } from "@/lib/generators/registry";
import { buildRenderInput, resolvePalette } from "@/lib/render/renderToTarget";
import { applyGrain } from "@/lib/render/grain";
import { drawOverlays } from "@/lib/render/overlays";
import { createRng } from "@/lib/prng";
import { useEditorStore } from "@/store/useEditorStore";
import { buildRendererError, type GenerationError } from "@/lib/render/generationState";
import type { FrameStyle } from "@/lib/devices/presets";
import type { WebGLTarget } from "@/lib/generators/types";

type Props = {
  frame: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame, aspect, maxWidth, maxHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderError, setRenderError] = useState<GenerationError | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const generatorId = useEditorStore((s) => s.generatorId);
  const setGenerator = useEditorStore((s) => s.setGenerator);

  const offscreenGlRef = useRef<{
    canvas: HTMLCanvasElement | OffscreenCanvas;
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    ensureRegistered();
  }, []);

  useEffect(() => {
    setRenderError(null);
  }, [generatorId]);

  const renderIfReady = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = useEditorStore.getState();
    const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
    const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));

    const input = buildRenderInput(s, { width: w, height: h });
    const generator = getGenerator(s.generatorId);
    const needsWebGL = generator?.kind === "shader";

    setIsRendering(true);

    try {
      if (needsWebGL) {
        let off = offscreenGlRef.current;
        if (!off || off.width !== w || off.height !== h) {
          let webglCanvas: HTMLCanvasElement | OffscreenCanvas | null = null;
          let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;

          if (typeof OffscreenCanvas !== "undefined") {
            try {
              const offscreen = new OffscreenCanvas(w, h);
              gl = (offscreen.getContext("webgl2", { preserveDrawingBuffer: true }) ||
                offscreen.getContext("webgl", { preserveDrawingBuffer: true })) as WebGL2RenderingContext | null;
              if (gl) webglCanvas = offscreen;
            } catch {}
          }

          if (!gl && typeof document !== "undefined") {
            webglCanvas = document.createElement("canvas");
            webglCanvas.width = w;
            webglCanvas.height = h;
            gl = (webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
              webglCanvas.getContext("webgl", { preserveDrawingBuffer: true })) as WebGL2RenderingContext | null;
          }

          if (!gl || !webglCanvas) {
            setRenderError(buildRendererError(s.generatorId, "unsupported"));
            setIsRendering(false);
            return;
          }

          off = { canvas: webglCanvas, gl, width: w, height: h };
          offscreenGlRef.current = off;
        }

        const webglTarget: WebGLTarget = { kind: "webgl", canvas: off.canvas, ctx: off.gl, width: w, height: h, dpr: 1 };
        const palette = resolvePalette(input.palette, input.mode, input.autoMode);
        const rng = createRng(input.seed);
        const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };

        generator?.render(webglTarget, input.params, input.seed, palette, rng, context);

        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) {
          setIsRendering(false);
          return;
        }
        canvas.width = w;
        canvas.height = h;

        if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
          (ctx2d as any).filter = `blur(${input.blurIntensity}px)`;
        }

        ctx2d.drawImage(off.canvas as any, 0, 0);

        if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
          (ctx2d as any).filter = "none";
        }

        const domTarget = { kind: "canvas2d" as const, canvas, ctx: ctx2d, width: w, height: h, dpr: 1 };
        if (input.grainEnabled && input.grainIntensity > 0) {
          applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
        }
        if (input.overlays) {
          drawOverlays(domTarget, input.overlays, input.palette);
        }
      } else {
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) {
          setIsRendering(false);
          return;
        }
        canvas.width = w;
        canvas.height = h;

        const palette = resolvePalette(input.palette, input.mode, input.autoMode);
        const rng = createRng(input.seed);
        const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };
        const domTarget = { kind: "canvas2d" as const, canvas, ctx: ctx2d, width: w, height: h, dpr: 1 };

        ctx2d.save();
        ctx2d.fillStyle = palette[0] ?? "#000000";
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.restore();

        generator?.render(domTarget, input.params, input.seed, palette, rng, context);

        if (input.grainEnabled && input.grainIntensity > 0) {
          applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
        }
        if (input.overlays) {
          drawOverlays(domTarget, input.overlays, input.palette);
        }
      }

      setRenderError(null);
    } catch (err) {
      setRenderError(buildRendererError(s.generatorId, "failed", err));
    } finally {
      setIsRendering(false);
    }
  }, [aspect, maxWidth, maxHeight]);

  useEffect(() => {
    let animationFrameId: number;
    let debounceTimer: ReturnType<typeof setTimeout>;

    const unsub = useEditorStore.subscribe(() => {
      clearTimeout(debounceTimer);
      // Debounce parameter adjustments by 50ms for slow-device safety
      debounceTimer = setTimeout(() => {
        if (typeof requestAnimationFrame !== "undefined") {
          animationFrameId = requestAnimationFrame(() => {
            renderIfReady();
          });
        } else {
          renderIfReady();
        }
      }, 50);
    });

    renderIfReady();

    return () => {
      unsub();
      clearTimeout(debounceTimer);
      if (typeof cancelAnimationFrame !== "undefined" && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [renderIfReady]);

  const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
  const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: w, height: h }}>
      {renderError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF8F4] border border-[#D4CDBC] rounded-lg shadow-sm z-20">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-xs font-medium text-[#2B2A26] max-w-xs leading-relaxed">
            {renderError.userMessage}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setGenerator("waveform")}
              className="rounded-lg bg-[#2B2A26] px-3 py-1.5 text-xs text-white shadow-xs hover:bg-[#1a1917]"
            >
              Switch to Waveform
            </button>
            <button
              type="button"
              onClick={() => setGenerator("geometric")}
              className="rounded-lg border border-[#D4CDBC] bg-white px-3 py-1.5 text-xs text-[#5B584F] hover:bg-[#F3EFE6]"
            >
              Switch to Geometric
            </button>
          </div>
        </div>
      ) : null}

      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        className={`h-full w-full object-contain ${renderError ? "hidden" : "block"}`}
      />

      {isRendering && !renderError && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 font-mono text-[10px] text-white z-10 pointer-events-none">
          <span className="animate-spin text-xs">✦</span>
          <span>Rendering…</span>
        </div>
      )}
    </div>
  );
}
