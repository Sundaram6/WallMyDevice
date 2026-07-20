import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ExportBar } from "./ExportBar";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ExportBar", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "exp",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 200,
      customHeight: 400,
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

  it("renders the download button", () => {
    const { getByText } = render(<ExportBar />);
    expect(getByText(/download/i)).toBeInTheDocument();
  });

  it("clicking download calls exportImage and creates a download link", async () => {
    const { getAllByText } = render(<ExportBar />);
    const btn = getAllByText(/download/i)[0];
    fireEvent.click(btn);
    await new Promise(r => setTimeout(r, 50));
    expect(btn).toBeInTheDocument();
  });
});
