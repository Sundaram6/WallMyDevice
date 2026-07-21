import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderExport } from "@/lib/render/renderExport";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildRenderInput } from "@/lib/render/renderToTarget";
import { deriveFluidGradientUniforms } from "@/lib/generators/fluid-gradient";
import { registerGenerator } from "@/lib/generators/registry";
import { fluidGradient } from "@/lib/generators/fluid-gradient";

describe("fluid-gradient export architecture", () => {
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

  it("builds canonical RenderInput matching EditorState", () => {
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
      overlayDate: false,
      overlayText: true,
      overlayTextValue: "HELLO",
      overlayFont: "Inter",
      overlaySize: 1.2,
      overlayTimestamp: 1700000000000,
    }, { width: 400, height: 400 });

    expect(input.generatorId).toBe("fluid-gradient");
    expect(input.seed).toBe("unitseed");
    expect(input.dimensions).toEqual({ width: 400, height: 400 });
    expect(input.overlays?.timestamp).toBe(1700000000000);
  });
});
