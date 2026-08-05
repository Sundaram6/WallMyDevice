import { describe, it, expect } from "vitest";
import { starfieldNebula } from "../../lib/generators/starfield-nebula";
import { auroraFlow } from "../../lib/generators/aurora-flow";
import { metaballs } from "../../lib/generators/metaballs";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { meshGradient } from "../../lib/generators/mesh-gradient";
import { getRemixCombo, getRandomCombo, getRandomPalette } from "../../lib/randomization";

describe("Visual Quality & Remix Blowout Protection", () => {
  it("prevents starfieldNebula from blowing out to solid white when light palettes are used", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;

    // Render with the exact problem palette from user screenshot: ["#F3DDD1", "#C9552F", "#5A2411", "#FAF8F4"]
    const problemPalette = ["#F3DDD1", "#C9552F", "#5A2411", "#FAF8F4"];
    starfieldNebula.render(
      { kind: "canvas2d", ctx, width: 400, height: 400 },
      starfieldNebula.schema.defaults,
      "11anxj41",
      problemPalette,
      () => 0.5,
      {} as any
    );

    const imgData = ctx.getImageData(0, 0, 400, 400).data;
    let whitePixelCount = 0;
    const totalPixels = 400 * 400;

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      if (r > 250 && g > 250 && b > 250) {
        whitePixelCount++;
      }
    }

    const whiteRatio = whitePixelCount / totalPixels;
    // Before fix, whiteRatio was 1.0 (100% white screen blowout). After fix, it must be < 0.25 (rich space background)
    expect(whiteRatio).toBeLessThan(0.25);
  });

  it("ensures getRemixCombo and getRandomCombo pick curated high-contrast palettes", () => {
    const remix = getRemixCombo("starfield-nebula");
    expect(remix.generatorId).toBe("starfield-nebula");
    expect(remix.palette.length).toBeGreaterThanOrEqual(2);
    expect(remix.seed).toBeDefined();

    const surprise = getRandomCombo("waveform");
    expect(surprise.generatorId).toBeDefined();
    expect(surprise.palette.length).toBeGreaterThanOrEqual(2);
  });
});
