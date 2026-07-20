import { describe, it, expect } from "vitest";
import { batchExport } from "./batchExport";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";
import { buildFilename } from "./filename";

describe("batchExport", () => {
  it("produces a zip with one entry per requested size", async () => {
    ensureRegistered();
    const input = {
      generatorId: "waveform",
      params: waveform.schema.defaults,
      palette: ["#000", "#fff"],
      mode: "dark" as const,
      seed: "batch",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    };
    const sizes = [
      { width: 200, height: 400 },
      { width: 400, height: 800 },
    ];
    const zip = await batchExport(input, sizes, "k3p9x2a7");
    expect(zip.type).toBe("application/zip");
    expect(zip.size).toBeGreaterThan(0);

    const { default: JSZip } = await import("jszip");
    const parsed = await JSZip.loadAsync(zip);
    const names = Object.keys(parsed.files);
    expect(names).toContain(buildFilename("waveform", "k3p9x2a7", sizes[0], "png"));
    expect(names).toContain(buildFilename("waveform", "k3p9x2a7", sizes[1], "png"));
  });
});
