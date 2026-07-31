import { describe, it, expect } from "vitest";
import { editorCore } from "./EditorCore";

describe("Phase 1 — Architecture Foundation (EditorCore)", () => {
  it("should initialize all 12 core engines in the facade", () => {
    expect(editorCore.theme).toBeDefined();
    expect(editorCore.config).toBeDefined();
    expect(editorCore.device).toBeDefined();
    expect(editorCore.canvas).toBeDefined();
    expect(editorCore.workspace).toBeDefined();
    expect(editorCore.selection).toBeDefined();
    expect(editorCore.transform).toBeDefined();
    expect(editorCore.layer).toBeDefined();
    expect(editorCore.history).toBeDefined();
    expect(editorCore.export).toBeDefined();
    expect(editorCore.plugin).toBeDefined();
    expect(editorCore.rendering).toBeDefined();
  });

  it("should handle theme engine transitions cleanly", () => {
    editorCore.theme.setMode("dark");
    expect(editorCore.theme.getMode()).toBe("dark");
    expect(editorCore.theme.getEffectiveScheme()).toBe("dark");

    editorCore.theme.setMode("light");
    expect(editorCore.theme.getMode()).toBe("light");
    expect(editorCore.theme.getEffectiveScheme()).toBe("light");
  });

  it("should perform coordinate normalization in CanvasEngine", () => {
    const norm = editorCore.canvas.normalizeCoordinates(960, 540, 1920, 1080);
    expect(norm.u).toBe(0.5);
    expect(norm.v).toBe(0.5);

    const denorm = editorCore.canvas.denormalizeCoordinates(norm.u, norm.v, 1920, 1080);
    expect(denorm.x).toBe(960);
    expect(denorm.y).toBe(540);
  });

  it("should manage history snapshots cleanly", () => {
    const history = editorCore.history;
    history.clear();
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);

    history.pushSnapshot("Initial", { count: 1 });
    history.pushSnapshot("Second", { count: 2 });

    expect(history.canUndo()).toBe(true);
    const undoState = history.undo({ count: 2 });
    expect(undoState).toEqual({ count: 2 });
    expect(history.canRedo()).toBe(true);
  });
});
