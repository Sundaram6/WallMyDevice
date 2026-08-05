import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Editor Store & Step-by-Step History", () => {
  beforeEach(async () => {
    vi.resetModules();
  });

  it("populates default parameters for the initial generator on cold import", async () => {
    const { useEditorStore } = await import("../store/useEditorStore");
    const state = useEditorStore.getState();
    const { waveform } = await import("../lib/generators/waveform");

    expect(state.generatorId).toBe("waveform");
    expect(state.params.waveform).toEqual(waveform.schema.defaults);
  });

  it("registers each action into history stack so undo/redo step back and forward 1 step at a time", async () => {
    const { useEditorStore } = await import("../store/useEditorStore");
    const store = useEditorStore.getState();

    const initialSeed = store.seed;

    // Step 1: Change Seed
    store.setSeed("seedstep1");
    expect(useEditorStore.getState().seed).toBe("seedstep1");
    expect(useEditorStore.getState().canUndo()).toBe(true);

    // Step 2: Change Mode
    store.setMode("dark");
    expect(useEditorStore.getState().mode).toBe("dark");

    // Step 3: Undo 1 step (should go back to light mode, seedstep1)
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().mode).toBe("light");
    expect(useEditorStore.getState().seed).toBe("seedstep1");
    expect(useEditorStore.getState().canRedo()).toBe(true);

    // Step 4: Undo 1 more step (should go back to initialSeed)
    useEditorStore.getState().undo();
    expect(useEditorStore.getState().seed).toBe(initialSeed);

    // Step 5: Redo 1 step (should go forward to seedstep1)
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().seed).toBe("seedstep1");
    expect(useEditorStore.getState().mode).toBe("light");

    // Step 6: Redo 1 more step (should go forward to dark mode)
    useEditorStore.getState().redo();
    expect(useEditorStore.getState().mode).toBe("dark");
  });
});
