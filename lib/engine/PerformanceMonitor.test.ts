import { describe, it, expect } from "vitest";
import { performanceMonitor } from "./PerformanceMonitor";
import { editorCore } from "./EditorCore";

describe("Phase 6 — Polish, Performance & Final QA", () => {
  it("should record device switching latency under target 100ms threshold", () => {
    const start = performance.now();
    const device = editorCore.device.getDevice("samsung-galaxy-s25-ultra");
    const latency = performanceMonitor.recordDeviceSwitch(start);

    expect(device).toBeDefined();
    expect(device?.brand).toBe("Samsung");
    expect(latency).toBeLessThan(100);
    expect(performanceMonitor.isPerformanceTargetMet()).toBe(true);
  });

  it("should track render passes and maintain 60 FPS metrics target", () => {
    performanceMonitor.recordRenderPass();
    const metrics = performanceMonitor.getMetrics();
    expect(metrics.fps).toBe(60);
    expect(metrics.renderPassCount).toBeGreaterThan(0);
  });

  it("should satisfy Final Acceptance Criteria for preview visibility and modular facade architecture", () => {
    expect(editorCore).toBeDefined();
    expect(editorCore.canvas).toBeDefined();
    expect(editorCore.device).toBeDefined();
    expect(editorCore.theme).toBeDefined();

    // Verify 100% visible viewport scaling calculation
    const viewport = editorCore.canvas.calculateFitViewport(1000, 800, 1440 / 3120);
    expect(viewport.scaleFactor).toBeLessThanOrEqual(1.0);
    expect(viewport.canvasWidth).toBeGreaterThan(0);
    expect(viewport.canvasHeight).toBeGreaterThan(0);
  });
});
