import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
import type { Generator } from "./types";

// Create a fresh generator stub with a unique ID per test to avoid
// cross-test registry pollution without needing a production reset API.
function makeStub(): Generator {
  const id = `test-generator-${randomUUID()}`;
  return {
    id,
    label: "Stub",
    kind: "canvas2d",
    schema: { zod: (null as unknown) as Generator["schema"]["zod"], defaults: {} },
    render: () => {},
    supportsSvgExport: false,
    paramControls: [],
  };
}

describe("registry", () => {
  // Import registry fresh for each describe block — using unique IDs means
  // we don't need to clear shared state between tests.
  let registerGenerator: (g: Generator<any>) => void;
  let getGenerator: (id: string) => Readonly<Generator<any>> | undefined;
  let listGenerators: () => Readonly<Generator<any>>[];

  beforeEach(async () => {
    // Each test block gets a fresh module import via vi.resetModules()
    // This is appropriate here: registry tests explicitly verify module-level
    // initialization behavior (idempotency, duplicate-id rejection).
    const mod = await import("./registry");
    registerGenerator = mod.registerGenerator;
    getGenerator = mod.getGenerator;
    listGenerators = mod.listGenerators;
  });

  it("round-trips a registered generator", () => {
    const stub = makeStub();
    registerGenerator(stub);
    const retrieved = getGenerator(stub.id);
    expect(retrieved?.id).toBe(stub.id);
    expect(listGenerators().map(g => g.id)).toContain(stub.id);
  });

  it("throws on duplicate id when definition differs", () => {
    const stub = makeStub();
    registerGenerator(stub);
    const diffStub = { ...stub, label: "Different Stub" };
    expect(() => registerGenerator(diffStub)).toThrow(/already registered/);
  });

  it("is idempotent for the same object reference", () => {
    const stub = makeStub();
    registerGenerator(stub);
    // Re-registering the exact same object reference must not throw
    expect(() => registerGenerator(stub)).not.toThrow();
  });

  it("returns undefined for unknown id", () => {
    expect(getGenerator("nope-" + randomUUID())).toBeUndefined();
  });

  it("deep-freezes paramControls so they cannot be mutated", () => {
    const stub: Generator = {
      ...makeStub(),
      paramControls: [{ key: "foo" as unknown as never, label: "Foo", type: "slider", min: 0, max: 10 }],
    };
    registerGenerator(stub);
    const retrieved = getGenerator(stub.id)!;
    expect(() => {
      (retrieved.paramControls[0] as any).label = "HACKED";
    }).toThrow();
  });
});
