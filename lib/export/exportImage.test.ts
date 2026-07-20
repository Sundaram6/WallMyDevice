import { describe, it, expect } from "vitest";
import { exportImage } from "./exportImage";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";

describe("exportImage", () => {
  it("produces a PNG blob for a raster generator", async () => {
    ensureRegistered();
    const blob = await exportImage(
      {
        generatorId: "waveform",
        params: waveform.schema.defaults,
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      },
      { width: 200, height: 400 }
    );
    expect(blob.type).toBe("image/png");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("returns a JPG blob when type is jpg", async () => {
    ensureRegistered();
    const blob = await exportImage(
      {
        generatorId: "waveform",
        params: waveform.schema.defaults,
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      },
      { width: 200, height: 400 },
      "jpg"
    );
    expect(blob.type).toBe("image/jpeg");
  });
});
