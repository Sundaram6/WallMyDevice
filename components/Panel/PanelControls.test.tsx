import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ModeToggle } from "./ModeToggle";
import { SeedBar } from "./SeedBar";
import { ResolutionPicker } from "./ResolutionPicker";
import { useEditorStore } from "@/store/useEditorStore";
import { waveform } from "@/lib/generators/waveform";

function reset() {
  useEditorStore.setState({
    generatorId: "waveform",
    params: { waveform: waveform.schema.defaults },
    palette: ["#000", "#fff"],
    mode: "dark",
    seed: "abcdef",
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
}

describe("ModeToggle", () => {
  beforeEach(reset);
  afterEach(cleanup);
  it("switches to light when clicked", () => {
    const { getByText } = render(<ModeToggle />);
    fireEvent.click(getByText("Light"));
    expect(useEditorStore.getState().mode).toBe("light");
  });
});

describe("SeedBar", () => {
  beforeEach(reset);
  afterEach(cleanup);
  it("shows current seed", () => {
    const { container } = render(<SeedBar />);
    const input = container.querySelector("input[type=\"text\"]") as HTMLInputElement;
    expect(input.value).toBe("abcdef");
  });
  it("randomize changes the seed", () => {
    const { getByLabelText } = render(<SeedBar />);
    fireEvent.click(getByLabelText("Randomize seed"));
    expect(useEditorStore.getState().seed).not.toBe("abcdef");
  });
});

describe("ResolutionPicker", () => {
  beforeEach(reset);
  afterEach(cleanup);
  it("selecting a preset updates the store", () => {
    const { container } = render(<ResolutionPicker />);
    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "iphone-15-pro" } });
    expect(useEditorStore.getState().resolutionId).toBe("iphone-15-pro");
  });
});