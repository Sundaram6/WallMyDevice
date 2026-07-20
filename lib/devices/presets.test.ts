import { describe, it, expect } from "vitest";
import { DEVICE_PRESETS, findPreset, ASPECT_PRESETS } from "./presets";

describe("DEVICE_PRESETS", () => {
  it("has 10 entries including custom", () => {
    expect(DEVICE_PRESETS.length).toBe(10);
    expect(DEVICE_PRESETS.find(p => p.id === "custom")).toBeDefined();
  });

  it("all dimensions are at least 320", () => {
    for (const p of DEVICE_PRESETS) {
      expect(p.w).toBeGreaterThanOrEqual(320);
      expect(p.h).toBeGreaterThanOrEqual(320);
    }
  });
});

describe("findPreset", () => {
  it("returns preset by id", () => {
    expect(findPreset("iphone-15-pro")?.label).toBe("iPhone 15 Pro");
  });
  it("returns undefined for unknown id", () => {
    expect(findPreset("nope")).toBeUndefined();
  });
});

describe("ASPECT_PRESETS", () => {
  it("has 6 common aspect ratios", () => {
    expect(ASPECT_PRESETS.length).toBe(6);
  });
});
