import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { DropZone } from "./DropZone";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

const VALID_RECIPE = JSON.stringify({
  v: 1,
  type: "wallmydevice/recipe",
  generator: "waveform",
  params: waveform.schema.defaults,
  palette: ["#000000", "#ffffff"],
  mode: "dark",
  seed: "test123",
  grain: { enabled: false, intensity: 0 },
  blur: 0,
  resolution: { preset: "desktop-1080p", width: 1920, height: 1080 },
  overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
});

function dropFile(container: HTMLElement, fileContent: string, fileName: string = "recipe.json") {
  const file = new File([fileContent], fileName, { type: "application/json" });
  const dataTransfer = { files: [file] };
  fireEvent.drop(container, { dataTransfer });
}

describe("DropZone", () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000000", "#ffffff"],
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
      sheetCollapsed: true,
    });
  });

  it("renders children", () => {
    const { getByTestId } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    expect(getByTestId("child")).toBeTruthy();
  });

  it("shows overlay on drag over", () => {
    const { getByText, container } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    fireEvent.dragOver(container.firstChild!, { dataTransfer: { files: [] } });
    expect(getByText("Drop recipe JSON to import")).toBeTruthy();
  });

  it("hides overlay on drag leave", () => {
    const { container } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    const wrapper = container.querySelector(".relative")!;
    fireEvent.dragOver(wrapper, { dataTransfer: { files: [] } });
    expect(wrapper.querySelector("[class*='absolute inset-0']")).toBeTruthy();
    fireEvent.dragLeave(wrapper, { dataTransfer: { files: [] } });
    expect(wrapper.querySelector("[class*='absolute inset-0']")).toBeNull();
  });

  it("accepts valid JSON and applies recipe", () => {
    const { container } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    dropFile(container, VALID_RECIPE);
    waitFor(() => {
      expect(useEditorStore.getState().seed).toBe("test123");
    });
  });

  it("rejects non-JSON file", async () => {
    const { container, getByText } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    const file = new File(["not json"], "recipe.txt", { type: "text/plain" });
    fireEvent.drop(container.firstChild!, { dataTransfer: { files: [file] } });
    await waitFor(() => {
      expect(getByText("Only .json files are accepted")).toBeTruthy();
    });
  });

  it("rejects multiple files", async () => {
    const { container, getByText } = render(
      <DropZone>
        <div data-testid="child">Hello</div>
      </DropZone>
    );
    const file1 = new File(["{}"], "a.json", { type: "application/json" });
    const file2 = new File(["{}"], "b.json", { type: "application/json" });
    fireEvent.drop(container.firstChild!, { dataTransfer: { files: [file1, file2] } });
    await waitFor(() => {
      expect(getByText("Please drop a single file")).toBeTruthy();
    });
  });
});
