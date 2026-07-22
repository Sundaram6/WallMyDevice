import type { z } from "zod";

export type Rng = () => number;

export type Canvas2DTarget = {
  kind: "canvas2d";
  canvas: HTMLCanvasElement | OffscreenCanvas;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
};

export type WebGLTarget = {
  kind: "webgl";
  canvas: HTMLCanvasElement | OffscreenCanvas;
  ctx: WebGLRenderingContext | WebGL2RenderingContext;
  width: number;
  height: number;
  dpr: number;
};

export type RenderTarget = Canvas2DTarget | WebGLTarget;

export type GlobalContext = {
  blur: number;
  grain: { enabled: boolean; intensity: number };
};

export type ParamSchema<S extends z.ZodTypeAny> = {
  zod: S;
  defaults: z.infer<S>;
};

export type ParamControl<P> = {
  key: keyof P;
  label: string;
  type: "slider" | "color" | "select" | "toggle" | "text";
  min?: number;
  max?: number;
  step?: number;
  options?: readonly { value: string; label: string }[];
  helperText?: string;
};

export type Generator<P = unknown> = {
  id: string;
  label: string;
  description?: string;
  kind: "canvas2d" | "shader";
  schema: ParamSchema<z.ZodType<P>>;
  render: (
    target: RenderTarget,
    params: P,
    seed: string,
    palette: string[],
    rng: Rng,
    context: GlobalContext
  ) => void;
  toSvg?: (
    size: { width: number; height: number },
    params: P,
    seed: string,
    palette: string[]
  ) => string;
  supportsSvgExport: boolean;
  paramControls: ParamControl<P>[];
};
