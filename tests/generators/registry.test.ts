import { describe, it, expect, beforeEach } from "vitest";
import { 
  registerGenerator, 
  getGenerator, 
  listGenerators 
} from "../../lib/generators/registry";
import { waveform } from "../../lib/generators/waveform";

describe("Generator Registry", () => {
  beforeEach(() => {
    // Reset registry by re-importing if possible, 
    // but since registry might be module-scoped we need to handle it.
    // For testing duplicate registrations, we can just use dummy generators.
  });

  it("throws when registering a different generator with an existing ID", () => {
    const dummy1 = { ...waveform, id: "test-duplicate" };
    const dummy2 = { ...waveform, id: "test-duplicate", label: "Different Label" };
    
    registerGenerator(dummy1);
    
    expect(() => registerGenerator(dummy2)).toThrow(/already registered/i);
  });

  it("is idempotent when registering the exact same generator definition", () => {
    const dummy = { ...waveform, id: "test-idempotent" };
    
    registerGenerator(dummy);
    // Should not throw
    expect(() => registerGenerator(dummy)).not.toThrow();
  });

  it("does not allow mutating the registry via listGenerators", () => {
    const dummy = { ...waveform, id: "test-mutation" };
    registerGenerator(dummy);
    
    const list = listGenerators();
    list.push({ ...waveform, id: "test-hacked" });
    
    // The registry should not contain the hacked generator
    expect(getGenerator("test-hacked")).toBeUndefined();
  });

  it("does not allow mutating canonical default params", () => {
    const dummy = { 
      ...waveform, 
      id: "test-defaults",
      schema: {
        ...waveform.schema,
        defaults: { layers: 1, testKey: "original" }
      }
    };
    registerGenerator(dummy);
    
    const retrieved = getGenerator("test-defaults")!;
    // Attempt mutation
    try {
      (retrieved.schema.defaults as any).testKey = "mutated";
    } catch (e) {
      // It might throw if frozen, which is good
    }
    
    const retrievedAgain = getGenerator("test-defaults")!;
    expect((retrievedAgain.schema.defaults as any).testKey).toBe("original");
  });
});
