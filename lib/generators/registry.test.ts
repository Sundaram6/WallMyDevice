import { describe, it, expect, beforeEach } from "vitest";
import { registerGenerator, getGenerator, listGenerators, _resetRegistryForTests } from "./registry";
import type { Generator } from "./types";

const stub: Generator = {
  id: "stub-1",
  label: "Stub",
  kind: "canvas2d",
  schema: { zod: (null as unknown) as Generator["schema"]["zod"], defaults: {} },
  render: () => {},
  supportsSvgExport: false,
  paramControls: [],
};

describe("registry", () => {
  beforeEach(() => _resetRegistryForTests());

  it("round-trips a registered generator", () => {
    registerGenerator(stub);
    const retrieved = getGenerator("stub-1");
    expect(retrieved?.id).toBe("stub-1");
    expect(listGenerators().map(g => g.id)).toContain("stub-1");
  });

  it("throws on duplicate id when definition differs", () => {
    registerGenerator(stub);
    const diffStub = { ...stub, label: "Different Stub" };
    expect(() => registerGenerator(diffStub)).toThrow(/already registered/);
  });

  it("returns undefined for unknown id", () => {
    expect(getGenerator("nope")).toBeUndefined();
  });
});
