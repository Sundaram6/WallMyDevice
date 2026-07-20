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
    expect(getGenerator("stub-1")).toBe(stub);
    expect(listGenerators()).toContain(stub);
  });

  it("throws on duplicate id", () => {
    registerGenerator(stub);
    expect(() => registerGenerator(stub)).toThrow(/already registered/);
  });

  it("returns undefined for unknown id", () => {
    expect(getGenerator("nope")).toBeUndefined();
  });
});
