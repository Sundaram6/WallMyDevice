import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { createRng } from "../../lib/prng";

let lastProgram: any = null;

vi.mock("ogl", () => {
  class MockProgram {
    uniforms: Record<string, any> = {
      uResolution: { value: null },
      uPhase: { value: null },
      uSeed: { value: null },
      uColor0: { value: null },
      uColor1: { value: null },
      uColor2: { value: null },
      uColor3: { value: null },
      uColor4: { value: null },
      uColor5: { value: null },
      uColorCount: { value: null },
      uBlobCount: { value: null },
      uDistortion: { value: null },
      uSwirl: { value: null },
      uContrast: { value: null },
      uSaturation: { value: null },
    };
    constructor() {
      lastProgram = this;
    }
  }
  return {
    Renderer: class {
      setSize = vi.fn();
      render = vi.fn();
      gl: any;
    },
    Program: MockProgram,
    Mesh: class {},
    Triangle: class {},
    Vec3: class {
      constructor(public x: number, public y: number, public z: number) {}
    }
  };
});

// Since the generator expects WebGLRenderingContext to exist, mock it globally
(global as any).WebGLRenderingContext = class WebGLRenderingContext {};

describe("fluid-gradient determinism", () => {
  let perfNowSpy: any;

  beforeEach(() => {
    perfNowSpy = vi.spyOn(performance, 'now');
    lastProgram = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("produces identical output (uniforms) across renders with the same seed", () => {
    const dummyCanvas = document.createElement("canvas");
    const dummyCtx = Object.create((global as any).WebGLRenderingContext.prototype || {});
    dummyCtx.viewport = vi.fn();

    const params = fluidGradient.schema.defaults;

    const captureUniforms = (advanceTime: number) => {
      perfNowSpy.mockReturnValue(advanceTime);
      fluidGradient.render(
        { kind: "webgl", canvas: dummyCanvas, ctx: dummyCtx, width: 200, height: 400, dpr: 1 }, 
        params, 
        "deterministic-seed", 
        ["#ff0000", "#00ff00"], 
        createRng("deterministic-seed"), 
        { blur: 0, grain: { enabled: false, intensity: 0 } }
      );
      
      return JSON.parse(JSON.stringify(lastProgram?.uniforms || {}));
    };

    const first = captureUniforms(0);
    const second = captureUniforms(5000);

    expect(second).toEqual(first);
  });

  it("produces different uniforms for different seeds", () => {
    const dummyCanvas = document.createElement("canvas");
    const dummyCtx = Object.create((global as any).WebGLRenderingContext.prototype || {});
    dummyCtx.viewport = vi.fn();

    const params = fluidGradient.schema.defaults;

    const captureUniforms = (seed: string) => {
      fluidGradient.render(
        { kind: "webgl", canvas: dummyCanvas, ctx: dummyCtx, width: 200, height: 400, dpr: 1 }, 
        params, 
        seed, 
        ["#ff0000", "#00ff00"], 
        createRng(seed), 
        { blur: 0, grain: { enabled: false, intensity: 0 } }
      );
      
      return JSON.parse(JSON.stringify(lastProgram?.uniforms || {}));
    };

    const first = captureUniforms("seed-a");
    const second = captureUniforms("seed-b");

    expect(second.uPhase).not.toEqual(first.uPhase);
    expect(second.uSeed).not.toEqual(first.uSeed);
  });

  it("proves shared RNG non-consumption", () => {
    const dummyCanvas = document.createElement("canvas");
    const dummyCtx = Object.create((global as any).WebGLRenderingContext.prototype || {});
    dummyCtx.viewport = vi.fn();

    const suppliedRng = createRng("shared-seed");
    const controlRng = createRng("shared-seed");

    fluidGradient.render(
      { kind: "webgl", canvas: dummyCanvas, ctx: dummyCtx, width: 200, height: 400, dpr: 1 }, 
      fluidGradient.schema.defaults, 
      "test-seed", 
      ["#ff0000", "#00ff00"], 
      suppliedRng, 
      { blur: 0, grain: { enabled: false, intensity: 0 } }
    );

    expect(suppliedRng()).toBe(controlRng());
  });
});
