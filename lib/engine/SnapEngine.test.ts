import { describe, it, expect } from "vitest";
import { snapEngine } from "./SnapEngine";

describe("Phase 4 — Editing System (SnapEngine & Proportional Scaling)", () => {
  it("should snap to canvas horizontal center line when close", () => {
    // Canvas 1000x1000, Center is X=500. Object width 100 => Center X=500 requires X=450.
    const res = snapEngine.calculateSnap(448, 200, 100, 100, 1000, 1000);
    expect(res.snappedX).toBe(true);
    expect(res.x).toBe(450);
    expect(res.guides.some((g) => g.label === "Center X")).toBe(true);
  });

  it("should snap to canvas vertical center line when close", () => {
    // Canvas 1000x1000, Center is Y=500. Object height 100 => Center Y=500 requires Y=450.
    const res = snapEngine.calculateSnap(200, 452, 100, 100, 1000, 1000);
    expect(res.snappedY).toBe(true);
    expect(res.y).toBe(450);
    expect(res.guides.some((g) => g.label === "Center Y")).toBe(true);
  });

  it("should snap to safe area top boundary", () => {
    const res = snapEngine.calculateSnap(200, 102, 100, 100, 1000, 1000, 100, 80);
    expect(res.snappedY).toBe(true);
    expect(res.y).toBe(100);
    expect(res.guides.some((g) => g.label === "Safe Area Top")).toBe(true);
  });
});
