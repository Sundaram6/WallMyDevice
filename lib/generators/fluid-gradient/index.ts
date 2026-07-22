import { z } from "zod";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import { createRng, deriveSeed } from "../../prng";
import type { Generator, RenderTarget, GlobalContext } from "../types";
import { VERT, FRAG } from "./shader.glsl";

const Schema = z.object({
  blobCount: z.number().min(1).max(8),
  distortion: z.number().min(0).max(2),
  swirl: z.number().min(0).max(2),
  contrast: z.number().min(0.1).max(4),
  saturation: z.number().min(0).max(2),
});

type Params = z.infer<typeof Schema>;

function hexToVec3(hex: string): Vec3 {
  const m = hex.replace("#", "");
  return new Vec3(
    parseInt(m.substring(0, 2), 16) / 255,
    parseInt(m.substring(2, 4), 16) / 255,
    parseInt(m.substring(4, 6), 16) / 255
  );
}

export function deriveFluidGradientUniforms(seed: string): { phase: number; shaderSeed: number } {
  const phaseRng = createRng(deriveSeed(seed, "fluid-gradient-phase"));
  const phaseVal = phaseRng() * 2 * Math.PI;

  const shaderSeedRng = createRng(deriveSeed(seed, "fluid-gradient-shader-seed"));
  const seedVal = shaderSeedRng();

  return { phase: phaseVal, shaderSeed: seedVal * 100.0 };
}

type FluidResources = {
  renderer: Renderer;
  program: Program;
  mesh: Mesh;
};

const resourcesByContext = new WeakMap<object, FluidResources>();

function ensureSetup(target: RenderTarget): FluidResources {
  if (target.kind !== "webgl") {
    throw new Error("fluid-gradient requires a WebGL target");
  }

  const gl = target.ctx;
  const dpr = target.dpr ?? 1;
  const pixelWidth = target.width * dpr;
  const pixelHeight = target.height * dpr;

  // Hardware limit check
  if (typeof gl.getParameter === "function") {
    try {
      const maxViewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxRenderbuffer = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

      if (maxViewport && (pixelWidth > maxViewport[0] || pixelHeight > maxViewport[1])) {
        throw new Error(
          `Requested dimensions (${target.width}x${target.height}) exceed WebGL max viewport limits (${maxViewport[0]}x${maxViewport[1]}) for generator "fluid-gradient". Suggested smaller size: ${maxViewport[0]}x${maxViewport[1]}`
        );
      }
      if (maxTexture && (pixelWidth > maxTexture || pixelHeight > maxTexture)) {
        throw new Error(
          `Requested dimensions (${target.width}x${target.height}) exceed WebGL max texture size (${maxTexture}) for generator "fluid-gradient". Suggested smaller size: ${maxTexture}x${maxTexture}`
        );
      }
      if (maxRenderbuffer && (pixelWidth > maxRenderbuffer || pixelHeight > maxRenderbuffer)) {
        throw new Error(
          `Requested dimensions (${target.width}x${target.height}) exceed WebGL max renderbuffer size (${maxRenderbuffer}) for generator "fluid-gradient". Suggested smaller size: ${maxRenderbuffer}x${maxRenderbuffer}`
        );
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("exceed WebGL")) {
        throw err;
      }
    }
  }

  let res = resourcesByContext.get(gl);
  if (res) return res;

  const renderer = new Renderer({ gl: gl as any, dpr: 1 } as any);
  (gl as any).renderer = renderer;
  if (!renderer.bindVertexArray) {
    renderer.bindVertexArray = (() => {}) as any;
  }

  const program = new Program(gl as any, {
    vertex: VERT,
    fragment: FRAG,
    transparent: false,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uResolution: { value: [0, 0] },
      uPhase: { value: 0 },
      uSeed: { value: 0 },
      uColor0: { value: [0, 0, 0] },
      uColor1: { value: [0, 0, 0] },
      uColor2: { value: [0, 0, 0] },
      uColor3: { value: [0, 0, 0] },
      uColor4: { value: [0, 0, 0] },
      uColor5: { value: [0, 0, 0] },
      uColorCount: { value: 0 },
      uBlobCount: { value: 0 },
      uDistortion: { value: 0 },
      uSwirl: { value: 0 },
      uContrast: { value: 0 },
      uSaturation: { value: 0 },
    },
  });

  const geometry = new Triangle(gl as any);
  const mesh = new Mesh(gl as any, { geometry, program });

  res = { renderer, program, mesh };
  resourcesByContext.set(gl, res);
  return res;
}

export const fluidGradient: Generator<Params> = {
  id: "fluid-gradient",
  label: "Fluid Gradient",
  description: "Dynamic WebGL liquid gradient mesh",
  kind: "shader",
  schema: {
    zod: Schema,
    defaults: { blobCount: 3, distortion: 0.5, swirl: 0.5, contrast: 1, saturation: 1 },
  },
  supportsSvgExport: false,
  paramControls: [
    { key: "blobCount", label: "Blob count", type: "slider", min: 1, max: 8, step: 1 },
    { key: "distortion", label: "Distortion", type: "slider", min: 0, max: 2, step: 0.01 },
    { key: "swirl", label: "Swirl", type: "slider", min: 0, max: 2, step: 0.01 },
    { key: "contrast", label: "Contrast", type: "slider", min: 0.1, max: 4, step: 0.05 },
    { key: "saturation", label: "Saturation", type: "slider", min: 0, max: 2, step: 0.01 },
  ],
  render(target, params, seed, palette, _rng, _context: GlobalContext) {
    const { renderer, program, mesh } = ensureSetup(target);
    const gl = target.ctx as WebGLRenderingContext;
    const fallback = palette[0] ?? "#000000";
    const padded = [...palette, fallback, fallback, fallback, fallback, fallback, fallback].slice(0, 6);
    const c = padded.map(hexToVec3);
    
    const { phase, shaderSeed } = deriveFluidGradientUniforms(seed);

    program.uniforms.uResolution.value = [target.width, target.height];
    program.uniforms.uPhase.value = phase;
    program.uniforms.uSeed.value = shaderSeed;
    program.uniforms.uColor0.value = [c[0].x, c[0].y, c[0].z];
    program.uniforms.uColor1.value = [c[1].x, c[1].y, c[1].z];
    program.uniforms.uColor2.value = [c[2].x, c[2].y, c[2].z];
    program.uniforms.uColor3.value = [c[3].x, c[3].y, c[3].z];
    program.uniforms.uColor4.value = [c[4].x, c[4].y, c[4].z];
    program.uniforms.uColor5.value = [c[5].x, c[5].y, c[5].z];
    program.uniforms.uColorCount.value = palette.length;
    program.uniforms.uBlobCount.value = params.blobCount;
    program.uniforms.uDistortion.value = params.distortion;
    program.uniforms.uSwirl.value = params.swirl;
    program.uniforms.uContrast.value = params.contrast;
    program.uniforms.uSaturation.value = params.saturation;

    if (gl.canvas && (gl.canvas.width !== target.width || gl.canvas.height !== target.height)) {
      renderer.setSize(target.width, target.height);
    }
    gl.viewport(0, 0, target.width, target.height);
    renderer.render({ scene: mesh });
    if (typeof gl.flush === "function") {
      gl.flush();
    }
  },
};
