import { describe, it, expect } from "vitest";
import { createRng, hashSeed, deriveSeed } from "./prng";

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

describe("deriveSeed", () => {
  it("is deterministic", () => {
    expect(deriveSeed("seed-a", "fluid-gradient-phase")).toBe(
      deriveSeed("seed-a", "fluid-gradient-phase")
    );
  });

  it("produces a fixed vector — changing deriveSeed breaks this test", () => {
    // This vector was recorded after the JSON.stringify([parent, ns]) format was adopted.
    // If it changes, deriveSeed is no longer backward-compatible within v0.1.1.
    // Vector: deriveSeed("seed-a", "fluid-gradient-phase") = "12ntsq0x"
    expect(deriveSeed("seed-a", "fluid-gradient-phase")).toBe("12ntsq0x");
  });

  it("is collision-resistant: distinct parent+namespace pairs do not collapse", () => {
    // Delimiter-injection vectors that would collide with naive concatenation:
    // hashSeed("abc" + ":" + "def") === hashSeed("ab" + ":" + "c:def")
    expect(deriveSeed("abc", "def")).not.toBe(deriveSeed("ab", "c:def"));
    expect(deriveSeed("a:b", "c")).not.toBe(deriveSeed("a", "b:c"));
    expect(deriveSeed("", "abc")).not.toBe(deriveSeed("abc", ""));
    expect(deriveSeed("x", "")).not.toBe(deriveSeed("", "x"));
  });

  it("different namespaces produce different seeds for the same parent", () => {
    expect(deriveSeed("myseed", "ns-a")).not.toBe(deriveSeed("myseed", "ns-b"));
  });

  it("different parents produce different seeds for the same namespace", () => {
    expect(deriveSeed("parent-1", "ns")).not.toBe(deriveSeed("parent-2", "ns"));
  });
});
