import { describe, it, expect } from "vitest";
import { createRng, hashSeed } from "./prng";

describe("hashSeed", () => {
  it("returns a deterministic 8-char base36 string", () => {
    expect(hashSeed("hello")).toBe(hashSeed("hello"));
    expect(hashSeed("hello")).toMatch(/^[0-9a-z]{8}$/);
  });

  it("produces different hashes for different seeds", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });
});

describe("createRng", () => {
  it("is deterministic for the same seed", () => {
    const a = createRng("seed-1");
    const b = createRng("seed-1");
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("produces values in [0, 1)", () => {
    const rng = createRng("test");
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("different seeds produce different sequences", () => {
    const a = createRng("alpha");
    const b = createRng("beta");
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });
});
