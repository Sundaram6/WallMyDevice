import { getGenerator } from "../generators/registry";
import { createRng } from "../prng";
import { applyGrain } from "./grain";
import { drawOverlays } from "./overlays";
import type { RenderTarget } from "../generators/types";

export type RenderInput = {
  generatorId: string;
  params: unknown;
  palette: string[];
  mode: "light" | "dark" | "auto";
  seed: string;
  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;
  autoMode?: "light" | "dark";
  dimensions?: { width: number; height: number };
  overlays?: {
    clock: boolean;
    date: boolean;
    text: boolean;
    textValue: string;
    font: string;
    size: number;
    timestamp?: number;
  };
};

export type Dimensions = { width: number; height: number };

export function buildRenderInput(
  state: {
    generatorId: string;
    params: Record<string, unknown>;
    palette: string[];
    mode: "light" | "dark" | "auto";
    seed: string;
    grainEnabled: boolean;
    grainIntensity: number;
    blurIntensity: number;
    overlayClock: boolean;
    overlayDate: boolean;
    overlayText: boolean;
    overlayTextValue: string;
    overlayFont: string;
    overlaySize: number;
    overlayTimestamp?: number;
  },
  dimensions: Dimensions
): RenderInput {
  return {
    generatorId: state.generatorId,
    params: (state.params[state.generatorId] ?? {}) as unknown,
    palette: state.palette,
    mode: state.mode,
    seed: state.seed,
    grainEnabled: state.grainEnabled,
    grainIntensity: state.grainIntensity,
    blurIntensity: state.blurIntensity,
    dimensions,
    overlays: {
      clock: state.overlayClock,
      date: state.overlayDate,
      text: state.overlayText,
      textValue: state.overlayTextValue,
      font: state.overlayFont,
      size: state.overlaySize,
      timestamp: state.overlayTimestamp,
    },
  };
}

export function renderToTarget(target: RenderTarget, input: RenderInput): void {
  const generator = getGenerator(input.generatorId);
  if (!generator) throw new Error(`Unknown generator "${input.generatorId}"`);

  const palette = resolvePalette(input.palette, input.mode, input.autoMode);
  const rng = createRng(input.seed);
  const context = {
    blur: input.blurIntensity,
    grain: { enabled: input.grainEnabled, intensity: input.grainIntensity },
  };

  if (target.kind === "canvas2d") {
    const ctx2d = target.ctx;
    if (typeof ctx2d.save === "function") {
      ctx2d.save();
      ctx2d.fillStyle = palette[0] ?? "#000000";
      ctx2d.fillRect(0, 0, target.width, target.height);
      ctx2d.restore();
    }
  }

  generator.render(target, input.params, input.seed, palette, rng, context);

  if (input.grainEnabled && input.grainIntensity > 0) {
    applyGrain(target, input.grainIntensity, input.seed + "|grain");
  }

  if (input.overlays) {
    drawOverlays(target, input.overlays, palette);
  }
}

export function resolvePalette(
  raw: string[],
  mode: "light" | "dark" | "auto",
  auto: "light" | "dark" = "dark"
): string[] {
  if (mode === "dark") return raw;
  if (mode === "light") return raw;
  return auto === "dark" ? raw : raw;
}
