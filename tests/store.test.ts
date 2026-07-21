import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Editor Store Cold Start", () => {
  beforeEach(async () => {
    vi.resetModules();
  });

  it("populates default parameters for the initial generator on cold import", async () => {
    // Dynamically import the store so it evaluates anew
    const { useEditorStore } = await import("../store/useEditorStore");
    const state = useEditorStore.getState();
    const { waveform } = await import("../lib/generators/waveform");
    
    // Default generator is waveform
    expect(state.generatorId).toBe("waveform");
    
    // The params should exactly match the expected schema defaults
    expect(state.params.waveform).toEqual(waveform.schema.defaults);
  });
});
