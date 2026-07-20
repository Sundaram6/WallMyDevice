import { describe, it, expect } from "vitest";
import { buildFilename } from "./filename";

describe("buildFilename", () => {
  it("builds a single image filename", () => {
    expect(buildFilename("waveform", "k3p9x2a7", { width: 1179, height: 2556 }, "png"))
      .toBe("wallmydevice-waveform-k3p9x2a7-1179x2556.png");
  });
  it("builds a batch filename", () => {
    expect(buildFilename.batch("1234567890"))
      .toBe("wallmydevice-batch-1234567890.zip");
  });
});
