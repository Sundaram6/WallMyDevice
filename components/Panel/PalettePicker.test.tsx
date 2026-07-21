import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PalettePicker } from "./PalettePicker";
import { useEditorStore } from "@/store/useEditorStore";
import { waveform } from "@/lib/generators/waveform";

describe("PalettePicker", () => {
  beforeEach(() => {
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000000", "#ffffff"],
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

  it("shows the curated palette swatches", () => {
    const { getAllByRole } = render(<PalettePicker />);
    expect(getAllByRole("button").length).toBeGreaterThan(0);
  });
});
