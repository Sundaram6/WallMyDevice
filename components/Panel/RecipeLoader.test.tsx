import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { RecipeLoader } from "./RecipeLoader";
import { useEditorStore } from "@/store/useEditorStore";
import { registerGenerator } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("RecipeLoader", () => {
  beforeEach(() => {
    registerGenerator(waveform);
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "old",
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

  it("pasting a valid recipe updates the store", () => {
    const { getByText, container } = render(<RecipeLoader />);
    fireEvent.click(getByText("Load recipe"));
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    const recipe = {
      v: 1, type: "wallmydevice/recipe", generator: "waveform",
      params: { layers: 9, jaggedness: 0.5, smoothing: 0.6, lineThickness: 2, amplitude: 0.8, fillBelow: false },
      palette: ["#111111", "#eeeeee"], mode: "light", seed: "newseed",
      grain: { enabled: true, intensity: 0.2 }, blur: 0,
      resolution: { preset: "custom", width: 800, height: 1200 },
      overlays: { clock: false, date: false, text: true, value: "hi", font: "Inter", size: 1.5 },
    };
    fireEvent.change(textarea, { target: { value: JSON.stringify(recipe) } });
    fireEvent.click(getByText("Load"));
    expect(useEditorStore.getState().seed).toBe("newseed");
    expect(useEditorStore.getState().mode).toBe("light");
  });

  it("invalid recipe shows an error", () => {
    const { getByText, container } = render(<RecipeLoader />);
    fireEvent.click(getByText("Load recipe"));
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "not json" } });
    fireEvent.click(getByText("Load"));
    expect(getByText(/not valid json/i)).toBeInTheDocument();
  });
});