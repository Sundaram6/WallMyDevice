import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PreviewCanvas } from "./PreviewCanvas";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("PreviewCanvas", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "preview-test",
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

  it("renders a canvas inside the device frame", () => {
    const { container } = render(<PreviewCanvas frame="desktop-monitor" aspect={16 / 9} maxWidth={800} maxHeight={450} />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("the canvas pixel size matches the requested display size", () => {
    const { container } = render(<PreviewCanvas frame="desktop-monitor" aspect={16 / 9} maxWidth={800} maxHeight={450} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(450);
  });
});
