import { describe, it, expect, beforeEach } from "vitest";
import { LOCAL_STATE_KEY, loadLocalState, saveLocalState, clearLocalState, type LocalState } from "./localState";

const validState: LocalState = {
  generatorId: "waveform",
  params: { waveform: { frequency: 3 } },
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark",
  seed: "k3p9x2a7",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
  resolutionId: "desktop-1080p",
  customWidth: 1920,
  customHeight: 1080,
  aspectLock: true,
  overlayClock: false,
  overlayDate: false,
  overlayText: false,
  overlayTextValue: "",
  overlayFont: "Inter",
  overlaySize: 1,
  exportFormat: "png",
};

describe("localState storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when nothing is stored", () => {
    expect(loadLocalState()).toBeNull();
  });

  it("round-trips a valid state through save and load", () => {
    saveLocalState(validState);
    expect(loadLocalState()).toEqual(validState);
  });

  it("returns null for malformed JSON", () => {
    localStorage.setItem(LOCAL_STATE_KEY, "{not json");
    expect(loadLocalState()).toBeNull();
  });

  it("returns null for a payload that fails schema validation", () => {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify({ ...validState, mode: "invalid-mode" }));
    expect(loadLocalState()).toBeNull();
  });

  it("rejects an out-of-range seed", () => {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify({ ...validState, seed: "NOT-VALID-SEED!" }));
    expect(loadLocalState()).toBeNull();
  });

  it("clears the stored state", () => {
    saveLocalState(validState);
    clearLocalState();
    expect(loadLocalState()).toBeNull();
  });
});
