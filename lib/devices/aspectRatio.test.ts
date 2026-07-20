import { describe, it, expect } from "vitest";
import { applyAspectLock, gcd } from "./aspectRatio";

describe("gcd", () => {
  it("returns the greatest common divisor", () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(1179, 2556)).toBe(9);
    expect(gcd(0, 100)).toBe(100);
  });
});

describe("applyAspectLock", () => {
  it("keeps height when width changes and lock is on (no-op for same ratio)", () => {
    const next = applyAspectLock({ w: 400, h: 200, locked: true }, "w");
    expect(next).toEqual({ w: 400, h: 200 });
  });

  it("does nothing when lock is off", () => {
    const next = applyAspectLock({ w: 500, h: 200, locked: false }, "w");
    expect(next).toEqual({ w: 500, h: 200 });
  });

  it("height is recomputed when width changes and lock is on", () => {
    const next = applyAspectLock({ w: 800, h: 400, locked: true }, "w");
    expect(next).toEqual({ w: 800, h: 400 });
  });
});
