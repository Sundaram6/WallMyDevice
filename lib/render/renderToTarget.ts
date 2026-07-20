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
  overlays?: {
    clock: boolean;
    date: boolean;
    text: boolean;
    textValue: string;
    font: string;
    size: number;
  };
};

export function renderToTarget(target: RenderTarget, input: RenderInput): void {
  const generator = getGenerator(input.generatorId);
  if (!generator) throw new Error(`Unknown generator "${input.generatorId}"`);

  const palette = resolvePalette(input.palette, input.mode, input.autoMode);
  const rng = createRng(input.seed);
  const context = {
    blur: input.blurIntensity,
    grain: { enabled: input.grainEnabled, intensity: input.grainIntensity },
  };

  if (target.ctx instanceof CanvasRenderingContext2D) {
    target.ctx.save();
    target.ctx.fillStyle = palette[0] ?? "#000000";
    target.ctx.fillRect(0, 0, target.width, target.height);
    target.ctx.restore();
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
