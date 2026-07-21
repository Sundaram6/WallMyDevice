import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ControlPanel } from "./ControlPanel";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered } from "../../lib/generators";
import { _resetRegistryForTests } from "../../lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ControlPanel", () => {
  afterEach(cleanup);

  beforeEach(() => {
    _resetRegistryForTests();
    ensureRegistered();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "aaaa",
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

  it("renders the waveform generator card", () => {
    const { getByText } = render(<ControlPanel />);
    expect(getByText("Waveform")).toBeInTheDocument();
  });

  it("clicking the generator card sets it as active", () => {
    const { getByText } = render(<ControlPanel />);
    fireEvent.click(getByText("Waveform"));
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });
});
