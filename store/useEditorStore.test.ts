import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./useEditorStore";
import { waveform } from "../lib/generators/waveform";

function reset() {
  useEditorStore.setState({
    generatorId: "waveform",
    params: { waveform: waveform.schema.defaults },
    palette: ["#000000", "#ffffff"],
    mode: "dark",
    seed: "aaaaaaaa",
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

describe("useEditorStore", () => {
  beforeEach(reset);

  it("switches generator and seeds default params", () => {
    useEditorStore.getState().setGenerator("waveform");
    expect(useEditorStore.getState().generatorId).toBe("waveform");
    expect(useEditorStore.getState().params.waveform).toEqual(waveform.schema.defaults);
  });

  it("updates a single param", () => {
    useEditorStore.getState().updateParam("waveform", "layers", 8);
    expect(useEditorStore.getState().params.waveform).toMatchObject({ layers: 8 });
  });

  it("randomizes seed to a valid base36 string", () => {
    useEditorStore.getState().randomizeSeed();
    const s = useEditorStore.getState().seed;
    expect(s).toMatch(/^[0-9a-z]+$/);
  });

  it("rejects invalid seeds on setSeed", () => {
    const before = useEditorStore.getState().seed;
    useEditorStore.getState().setSeed("!!!");
    expect(useEditorStore.getState().seed).toBe(before);
  });

  it("accepts valid seeds on setSeed", () => {
    useEditorStore.getState().setSeed("myseed");
    expect(useEditorStore.getState().seed).toBe("myseed");
  });
});
