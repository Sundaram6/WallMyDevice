import { z } from "zod";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
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

let renderer: Renderer | null = null;
let program: Program | null = null;
let mesh: Mesh | null = null;
let lastGl: WebGLRenderingContext | null = null;

function ensureSetup(target: RenderTarget) {
  if (program && lastGl === target.ctx) return;
  if (!(target.ctx instanceof WebGLRenderingContext)) {
    throw new Error("fluid-gradient requires a WebGL context");
  }
  const gl = target.ctx;
  if (renderer) {
    renderer.gl = gl;
  } else {
    renderer = new Renderer({ gl, dpr: 1 });
  }
  program = new Program(gl, { vertex: VERT, fragment: FRAG, transparent: false });
  const geometry = new Triangle(gl);
  mesh = new Mesh(gl, { geometry, program });
  lastGl = gl;
}

export const fluidGradient: Generator<Params> = {
  id: "fluid-gradient",
  label: "Fluid Gradient",
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
    ensureSetup(target);
    const gl = target.ctx as WebGLRenderingContext;
    if (renderer && program && mesh) {
      const padded = [palette[0] ?? "#000000", ...palette, ...palette].slice(0, 6);
      const colorVecs = padded.map(hexToVec3);
      const colorArray: [number, number, number][] = colorVecs.map(v => [v.x, v.y, v.z]);
      while (colorArray.length < 6) colorArray.push([0, 0, 0]);
      let seedNum = 0;
      for (let i = 0; i < seed.length; i++) seedNum = (seedNum * 31 + seed.charCodeAt(i)) >>> 0;
      program.uniforms.uResolution.value = [target.width, target.height];
      program.uniforms.uTime.value = performance.now() / 1000;
      program.uniforms.uSeed.value = (seedNum % 1000) / 1000;
      program.uniforms.uColors.value = colorArray;
      program.uniforms.uColorCount.value = palette.length;
      program.uniforms.uBlobCount.value = params.blobCount;
      program.uniforms.uDistortion.value = params.distortion;
      program.uniforms.uSwirl.value = params.swirl;
      program.uniforms.uContrast.value = params.contrast;
      program.uniforms.uSaturation.value = params.saturation;
      renderer.setSize(target.width, target.height);
      gl.viewport(0, 0, target.width, target.height);
      renderer.render({ scene: mesh });
    }
  },
};
