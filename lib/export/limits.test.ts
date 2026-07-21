import { describe, it, expect } from "vitest";
import { validateExportSize, MAX_WIDTH, MAX_HEIGHT, MAX_PIXELS } from "./limits";

describe("validateExportSize", () => {
  it("rejects zero width", () => {
    const result = validateExportSize(0, 1080);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Dimensions must be positive");
  });

  it("rejects zero height", () => {
    const result = validateExportSize(1920, 0);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Dimensions must be positive");
  });

  it("rejects negative dimensions", () => {
    const result = validateExportSize(-100, 1080);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Dimensions must be positive");
  });

  it("rejects width exceeding max", () => {
    const result = validateExportSize(MAX_WIDTH + 1, 1080);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(`Max dimension is ${MAX_WIDTH}px`);
  });

  it("rejects height exceeding max", () => {
    const result = validateExportSize(1920, MAX_HEIGHT + 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(`Max dimension is ${MAX_HEIGHT}px`);
  });

  it("rejects total pixels exceeding max", () => {
    const side = Math.ceil(Math.sqrt(MAX_PIXELS)) + 1;
    const result = validateExportSize(side, side);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("Max total pixels");
  });

  it("accepts valid dimensions", () => {
    const result = validateExportSize(1920, 1080);
    expect(result.ok).toBe(true);
  });

  it("accepts max allowed dimensions within pixel limit", () => {
    const result = validateExportSize(7071, 7071);
    expect(result.ok).toBe(true);
  });

  it("accepts 1x1 pixel", () => {
    const result = validateExportSize(1, 1);
    expect(result.ok).toBe(true);
  });
});
