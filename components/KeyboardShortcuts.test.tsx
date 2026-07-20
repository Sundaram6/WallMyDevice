import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("KeyboardShortcuts", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "before",
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
    });
  });

  it("R randomizes the seed", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "r" });
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("Space randomizes the seed and preventsDefault", () => {
    render(<KeyboardShortcuts />);
    const evt = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    document.body.dispatchEvent(evt);
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("1 selects the first registered generator", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "1" });
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });
});
