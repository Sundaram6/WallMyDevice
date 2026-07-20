import { describe, it, expect } from "vitest";
import { ensureRegistered, getGenerator } from "./index";

describe("ensureRegistered", () => {
  it("registers waveform so getGenerator finds it", () => {
    ensureRegistered();
    expect(getGenerator("waveform")).toBeDefined();
  });

  it("is idempotent", () => {
    ensureRegistered();
    ensureRegistered();
    expect(getGenerator("waveform")).toBeDefined();
  });
});
