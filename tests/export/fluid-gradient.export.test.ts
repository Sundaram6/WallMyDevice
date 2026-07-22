import { describe, it, expect, beforeEach } from "vitest";
import { type ShaderExportSession } from "@/lib/render/renderExport";
import { batchExport } from "@/lib/export/batchExport";
import { buildRenderInput } from "@/lib/render/renderToTarget";
import { deriveFluidGradientUniforms } from "@/lib/generators/fluid-gradient";
import { registerGenerator } from "@/lib/generators/registry";
import { fluidGradient } from "@/lib/generators/fluid-gradient";

describe("fluid-gradient export & session reuse architecture", () => {
  beforeEach(() => {
    registerGenerator(fluidGradient);
  });

  it("derives deterministic uniforms from seed", () => {
    const u1 = deriveFluidGradientUniforms("seedA");
    const u2 = deriveFluidGradientUniforms("seedA");
    const u3 = deriveFluidGradientUniforms("seedB");

    expect(u1.phase).toBe(u2.phase);
    expect(u1.shaderSeed).toBe(u2.shaderSeed);
    expect(u1.phase).not.toBe(u3.phase);
  });

  it("builds canonical RenderInput with renderTimestamp for deterministic overlays", () => {
    const input = buildRenderInput({
      generatorId: "fluid-gradient",
      params: { "fluid-gradient": { blobCount: 4, distortion: 0.8, swirl: 0.5, contrast: 1, saturation: 1 } },
      palette: ["#ff0000", "#00ff00"],
      mode: "dark",
      seed: "unitseed",
      grainEnabled: true,
      grainIntensity: 0.1,
      blurIntensity: 2,
      overlayClock: true,
      overlayDate: true,
      overlayText: true,
      overlayTextValue: "FIXED TIME",
      overlayFont: "Inter",
      overlaySize: 1.2,
      overlayTimestamp: 1700000000000,
    }, { width: 400, height: 400 });

    expect(input.generatorId).toBe("fluid-gradient");
    expect(input.seed).toBe("unitseed");
    expect(input.dimensions).toEqual({ width: 400, height: 400 });
    expect(input.overlays?.timestamp).toBe(1700000000000);
  });

  it("reuses a single ShaderExportSession during batch export and disposes it once", async () => {
    let renderCalls = 0;
    let disposeCalls = 0;

    const mockSession: ShaderExportSession = {
      render: async (input, size) => {
        renderCalls++;
        const canvas = new OffscreenCanvas(size.width, size.height);
        canvas.getContext("2d");
        return canvas;
      },
      dispose: () => {
        disposeCalls++;
      },
    };

    const input = buildRenderInput({
      generatorId: "fluid-gradient",
      params: { "fluid-gradient": { blobCount: 3, distortion: 0.5, swirl: 0.5, contrast: 1, saturation: 1 } },
      palette: ["#123456", "#abcdef"],
      mode: "dark",
      seed: "batchseed",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
    }, { width: 320, height: 320 });

    const sizes = [
      { width: 320, height: 320 },
      { width: 640, height: 640 },
      { width: 1280, height: 720 },
    ];

    await batchExport(input, sizes, "batchseed", undefined, {
      sessionFactory: () => mockSession,
    });

    expect(renderCalls).toBe(3);
    expect(disposeCalls).toBe(1);
  });
});
