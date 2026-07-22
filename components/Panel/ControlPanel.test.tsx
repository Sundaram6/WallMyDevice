import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ControlPanel } from "./ControlPanel";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered } from "../../lib/generators";
import { waveform } from "@/lib/generators/waveform";

describe("ControlPanel", () => {
  afterEach(cleanup);

  beforeEach(() => {
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

  it("default (sidebar) variant is hidden below md, matching the mobile BottomSheet handoff", () => {
    const { container } = render(<ControlPanel />);
    const aside = container.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside?.className).toMatch(/\bhidden\b/);
    expect(aside?.className).toMatch(/\bmd:flex\b/);
  });

  it("sheet variant renders the same controls with no sidebar chrome, for use inside BottomSheet", () => {
    const { container, getByText } = render(<ControlPanel variant="sheet" />);
    expect(container.querySelector("aside")).toBeNull();
    expect(getByText("Waveform")).toBeInTheDocument();
  });
});
