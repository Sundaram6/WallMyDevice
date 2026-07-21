import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Editor Store Cold Start", () => {
  beforeEach(async () => {
    vi.resetModules();
  });

  it("populates default parameters for the initial generator on cold import", async () => {
    // Dynamically import the store so it evaluates anew
    const { useEditorStore } = await import("../store/useEditorStore");
    const state = useEditorStore.getState();
    
    // Default generator is waveform
    expect(state.generatorId).toBe("waveform");
    
    // The params should not be empty `{}`
    expect(state.params.waveform).toBeDefined();
    expect(Object.keys(state.params.waveform as object).length).toBeGreaterThan(0);
    
    // Specifically, it should have the 'layers' parameter from waveform schema
    expect((state.params.waveform as any).layers).toBeDefined();
  });
});
