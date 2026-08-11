import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PreviewCanvas, getPreviewTierDimensions } from "./PreviewCanvas";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered } from "../../lib/generators";
import { waveform } from "@/lib/generators/waveform";

describe("PreviewCanvas Resolution Tiers", () => {
  beforeEach(() => {
    ensureRegistered();
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
      isInteracting: false,
    });
  });

  it("calculates dragging tier dimensions (380px long edge)", () => {
    const res = getPreviewTierDimensions(16 / 9, 1100, 900, true, false);
    expect(res.tier).toBe("dragging");
    expect(res.width).toBe(380);
    expect(res.height).toBe(214);
  });

  it("calculates idle-mobile tier dimensions (640px long edge)", () => {
    const res = getPreviewTierDimensions(9 / 16, 700, 600, false, true);
    expect(res.tier).toBe("idle-mobile");
    expect(res.height).toBe(600); // capped by maxHeight 600
    expect(res.width).toBe(338);
  });

  it("calculates idle-desktop tier dimensions (1200px long edge)", () => {
    const res = getPreviewTierDimensions(16 / 9, 1100, 900, false, false);
    expect(res.tier).toBe("idle-desktop");
    expect(res.width).toBe(1100);
    expect(res.height).toBe(619);
  });

  it("renders canvas element with data-render-tier attribute", () => {
    const { container } = render(<PreviewCanvas frame="desktop-monitor" aspect={16 / 9} maxWidth={800} maxHeight={450} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute("data-render-tier")).toBe("idle-desktop");
  });
});
