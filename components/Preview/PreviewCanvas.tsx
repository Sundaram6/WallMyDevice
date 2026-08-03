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
  frame?: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame = "iphone", aspect, maxWidth, maxHeight }: Props) {
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

  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const renderIfReady = useCallback(() => {
    if (!isMounted.current || typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = useEditorStore.getState();
    const w = maxWidth;
    const h = maxHeight;

    const input = buildRenderInput(s, { width: w, height: h });
    const generator = getGenerator(s.generatorId);
    const needsWebGL = generator?.kind === "shader";
    const activePalette = resolvePalette(input.palette, input.mode, input.autoMode);

    if (isMounted.current && typeof window !== "undefined") setIsRendering(true);

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
        const palette = activePalette;
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
          drawOverlays(domTarget, input.overlays, palette);
        }
      } else {
        const ctx2d = canvas.getContext("2d");
        if (!ctx2d) {
          setIsRendering(false);
          return;
        }
        canvas.width = w;
        canvas.height = h;

        const palette = activePalette;
        const rng = createRng(input.seed);
        const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };
        const domTarget = { kind: "canvas2d" as const, canvas, ctx: ctx2d, width: w, height: h, dpr: 1 };

        ctx2d.save();
        ctx2d.fillStyle = palette[0] ?? "black";
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

      // Dynamic Glow Sampling: Calculate dominant vibrant color from 5x5 canvas grid + activePalette fallback
      try {
        const ctx2d = canvas.getContext("2d");
        if (ctx2d && w > 0 && h > 0) {
          const samples: { r: number; g: number; b: number; sat: number; lum: number }[] = [];
          const grid = 5;
          for (let r = 1; r < grid; r++) {
            for (let c = 1; c < grid; c++) {
              const x = Math.floor((c * w) / grid);
              const y = Math.floor((r * h) / grid);
              try {
                const px = ctx2d.getImageData(x, y, 1, 1).data;
                const red = px[0], green = px[1], blue = px[2];
                const max = Math.max(red, green, blue);
                const min = Math.min(red, green, blue);
                const lum = (max + min) / 510;
                const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * lum - 1)) / 255;
                samples.push({ r: red, g: green, b: blue, sat, lum });
              } catch {}
            }
          }

          // Sort by highest saturation and non-black brightness (>0.08)
          const sorted = samples
            .filter(s => s.lum > 0.08)
            .sort((a, b) => (b.sat * 0.75 + b.lum * 0.25) - (a.sat * 0.75 + a.lum * 0.25));

          let red = 201, green = 85, blue = 47;

          if (sorted.length > 0 && sorted[0]) {
            red = sorted[0].r;
            green = sorted[0].g;
            blue = sorted[0].b;
          } else if (activePalette && activePalette.length > 0) {
            const colorHex = activePalette[activePalette.length - 1] ?? activePalette[1] ?? activePalette[0];
            if (colorHex && colorHex.startsWith("#")) {
              const hex = colorHex.replace("#", "");
              if (hex.length === 6) {
                red = parseInt(hex.substring(0, 2), 16);
                green = parseInt(hex.substring(2, 4), 16);
                blue = parseInt(hex.substring(4, 6), 16);
              }
            }
          }

          // Boost luminance & saturation if extracted color is too dark to register on dark backdrop
          const max = Math.max(red, green, blue);
          const min = Math.min(red, green, blue);
          let lum = (max + min) / 510;
          if (lum < 0.35) {
            const factor = 0.42 / Math.max(0.05, lum);
            red = Math.min(255, Math.round(red * factor + 35));
            green = Math.min(255, Math.round(green * factor + 35));
            blue = Math.min(255, Math.round(blue * factor + 35));
          }

          if (typeof document !== "undefined") {
            document.documentElement.style.setProperty("--glow-color", `rgb(${red}, ${green}, ${blue})`);
          }
        }
      } catch {}

      if (isMounted.current) setRenderError(null);
    } catch (err) {
      if (isMounted.current) setRenderError(buildRendererError(s.generatorId, "failed", err));
    } finally {
      if (isMounted.current) setIsRendering(false);
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

  const w = maxWidth;
  const h = maxHeight;

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: w, height: h }}>
      {renderError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-paper-100 border border-paper-300 rounded-lg shadow-1 z-20">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-xs font-medium text-ink-900 max-w-xs leading-relaxed">
            {renderError.userMessage}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => setGenerator("waveform")}
              className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs text-paper-0 shadow-1 hover:bg-accent-500 transition-colors duration-[--dur-fast]"
            >
              Switch to Waveform
            </button>
            <button
              type="button"
              onClick={() => setGenerator("geometric")}
              className="rounded-lg border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs text-ink-500 hover:bg-paper-200 transition-colors duration-[--dur-fast]"
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
        className={`h-full w-full object-contain transition-opacity duration-[--dur-canvas] ease-[--ease-out] ${renderError ? "opacity-0 hidden" : "opacity-100 block"}`}
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
