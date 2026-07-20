import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ParamsForm } from "./ParamsForm";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests, registerGenerator } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ParamsForm", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    registerGenerator(waveform);
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "abc",
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
  afterEach(cleanup);

  it("renders a control for every param of the active generator", () => {
    const { getByLabelText } = render(<ParamsForm />);
    for (const c of waveform.paramControls) {
      expect(getByLabelText(c.label)).toBeInTheDocument();
    }
  });

  it("changing the layers slider updates the store", () => {
    const { getByLabelText } = render(<ParamsForm />);
    const input = getByLabelText("Layers") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "8" } });
    expect((useEditorStore.getState().params.waveform as { layers: number }).layers).toBe(8);
  });
});