import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { StudioCore } from "./StudioCore";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered } from "@/lib/generators";

describe("Phase 3 — Studio Core & 3-Pane Layout", () => {
  afterEach(cleanup);

  beforeEach(() => {
    ensureRegistered();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: {} },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "aaaa",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      customWidth: 1920,
      customHeight: 1080,
      deviceType: "desktop",
      exportFormat: "png",
    });
  });

  it("renders top toolbar with WallMyDevice branding and export CTA", () => {
    const { getByText, getAllByText } = render(<StudioCore />);
    expect(getByText("WallMyDevice")).toBeInTheDocument();
    expect(getAllByText("Export")[0]).toBeInTheDocument();
  });

  it("renders 3-pane layout elements (left sidebar, center workspace, right sidebar)", () => {
    const { getByText } = render(<StudioCore />);
    expect(getByText("Generators")).toBeInTheDocument();
    expect(getByText("Params")).toBeInTheDocument();
  });

  it("renders bottom bar with resolution and fit view indicator", () => {
    const { getByText } = render(<StudioCore />);
    expect(getByText("1920 × 1080 px")).toBeInTheDocument();
    expect(getByText("Fit View")).toBeInTheDocument();
  });
});
