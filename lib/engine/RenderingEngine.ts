/**
 * RenderingEngine — Unified rendering orchestrator for Canvas2D and WebGL contexts.
 * Handles render target creation, offscreen buffers, shader execution,
 * noise/grain application, and overlay compositing.
 */

import type { FrameStyle } from "../devices/presets";
import { getGenerator } from "../generators/registry";
import { buildRenderInput, resolvePalette } from "../render/renderToTarget";
import { applyGrain } from "../render/grain";
import { drawOverlays, type OverlayState } from "../render/overlays";
import { createRng } from "../prng";
import type { WebGLTarget, Canvas2DTarget } from "../generators/types";

export interface RenderPassInput {
  generatorId: string;
  width: number;
  height: number;
  params: Record<string, unknown>;
  palette: string[];
  mode: "light" | "dark" | "auto";
  seed: string;
  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;
  overlays?: OverlayState;
}

export class RenderingEngine {
  private static instance: RenderingEngine;
  private offscreenGlCanvas: HTMLCanvasElement | OffscreenCanvas | null = null;
  private glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  private offscreenW: number = 0;
  private offscreenH: number = 0;

  private constructor() {}

  public static getInstance(): RenderingEngine {
    if (!RenderingEngine.instance) {
      RenderingEngine.instance = new RenderingEngine();
    }
    return RenderingEngine.instance;
  }

  public renderToCanvas(targetCanvas: HTMLCanvasElement, input: RenderPassInput): void {
    const generator = getGenerator(input.generatorId);
    if (!generator) {
      throw new Error(`Generator "${input.generatorId}" not found.`);
    }

    const { width: w, height: h } = input;
    targetCanvas.width = w;
    targetCanvas.height = h;

    const needsWebGL = generator.kind === "shader";
    const palette = resolvePalette(input.palette, input.mode, "dark");
    const rng = createRng(input.seed);
    const context = { blur: input.blurIntensity, grain: { enabled: input.grainEnabled, intensity: input.grainIntensity } };

    if (needsWebGL) {
      this.ensureOffscreenGL(w, h);
      if (!this.glContext || !this.offscreenGlCanvas) {
        throw new Error("WebGL context initialization failed.");
      }

      const webglTarget: WebGLTarget = {
        kind: "webgl",
        canvas: this.offscreenGlCanvas,
        ctx: this.glContext,
        width: w,
        height: h,
        dpr: 1,
      };

      generator.render(webglTarget, input.params, input.seed, palette, rng, context);

      const ctx2d = targetCanvas.getContext("2d");
      if (!ctx2d) return;

      if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
        (ctx2d as any).filter = `blur(${input.blurIntensity}px)`;
      }

      ctx2d.drawImage(this.offscreenGlCanvas as any, 0, 0);

      if (input.blurIntensity > 0 && typeof (ctx2d as any).filter === "string") {
        (ctx2d as any).filter = "none";
      }

      const domTarget: Canvas2DTarget = { kind: "canvas2d", canvas: targetCanvas, ctx: ctx2d, width: w, height: h, dpr: 1 };

      if (input.grainEnabled && input.grainIntensity > 0) {
        applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
      }
      if (input.overlays) {
        drawOverlays(domTarget, input.overlays, palette);
      }
    } else {
      const ctx2d = targetCanvas.getContext("2d");
      if (!ctx2d) return;

      const domTarget: Canvas2DTarget = { kind: "canvas2d", canvas: targetCanvas, ctx: ctx2d, width: w, height: h, dpr: 1 };

      ctx2d.save();
      ctx2d.fillStyle = palette[0] ?? "#000000";
      ctx2d.fillRect(0, 0, w, h);
      ctx2d.restore();

      generator.render(domTarget, input.params, input.seed, palette, rng, context);

      if (input.grainEnabled && input.grainIntensity > 0) {
        applyGrain(domTarget, input.grainIntensity, input.seed + "|grain");
      }
      if (input.overlays) {
        drawOverlays(domTarget, input.overlays, palette);
      }
    }
  }

  private ensureOffscreenGL(w: number, h: number): void {
    if (this.offscreenGlCanvas && this.glContext && this.offscreenW === w && this.offscreenH === h) {
      return;
    }

    if (typeof OffscreenCanvas !== "undefined") {
      try {
        const offscreen = new OffscreenCanvas(w, h);
        const gl = (offscreen.getContext("webgl2", { preserveDrawingBuffer: true }) ||
          offscreen.getContext("webgl", { preserveDrawingBuffer: true })) as WebGL2RenderingContext | null;
        if (gl) {
          this.offscreenGlCanvas = offscreen;
          this.glContext = gl;
          this.offscreenW = w;
          this.offscreenH = h;
          return;
        }
      } catch {}
    }

    if (typeof document !== "undefined") {
      const webglCanvas = document.createElement("canvas");
      webglCanvas.width = w;
      webglCanvas.height = h;
      const gl = (webglCanvas.getContext("webgl2", { preserveDrawingBuffer: true }) ||
        webglCanvas.getContext("webgl", { preserveDrawingBuffer: true })) as WebGL2RenderingContext | null;
      if (gl) {
        this.offscreenGlCanvas = webglCanvas;
        this.glContext = gl;
        this.offscreenW = w;
        this.offscreenH = h;
      }
    }
  }
}

export const renderingEngine = RenderingEngine.getInstance();
