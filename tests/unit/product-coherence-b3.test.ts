import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  checkWebGL2Support,
  buildRendererError,
  type GenerationStage,
} from "@/lib/render/generationState";
import { triggerSingleExport } from "@/lib/export/actions";

describe("Product Coherence Pass - Batch 3 Unit Tests (Generation & Resilient Fallbacks)", () => {
  it("detects WebGL2 capability safely without crashing", () => {
    const isSupported = checkWebGL2Support();
    expect(typeof isSupported).toBe("boolean");
  });

  it("builds a user-safe error boundary structure for unsupported WebGL", () => {
    const err = buildRendererError("fluid-gradient", "unsupported");
    expect(err.stage).toBe("unsupported");
    expect(err.recoverable).toBe(true);
    expect(err.userMessage).toContain("Your browser or device could not render this WebGL wallpaper");
    expect(err.suggestedGenerators).toContain("waveform");
    expect(err.suggestedGenerators).toContain("geometric");
  });

  it("builds user-safe error boundary for general rendering failure", () => {
    const err = buildRendererError("waveform", "failed", new Error("Canvas context lost"));
    expect(err.stage).toBe("failed");
    expect(err.userMessage).toContain("Rendering failed due to a device resources issue");
  });

  it("prevents duplicate concurrent export tasks", async () => {
    const statuses: string[] = [];
    const onProgress = (msg: string) => statuses.push(msg);

    // Trigger first export
    const p1 = triggerSingleExport({ width: 100, height: 100 }, onProgress);
    // Immediately trigger second export
    const p2 = triggerSingleExport({ width: 100, height: 100 }, onProgress);

    await Promise.allSettled([p1, p2]);

    expect(statuses).toContain("Export in progress…");
  });
});
