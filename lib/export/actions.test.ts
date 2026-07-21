import { describe, it, expect, vi, beforeEach } from "vitest";
import { geometric } from "@/lib/generators/geometric";
import { resolvePalette, buildRenderInput } from "@/lib/render/renderToTarget";

const toSvg = vi.fn(() => "<svg></svg>");

const storeState = {
  generatorId: "geometric",
  params: { geometric: geometric.schema.defaults },
  palette: ["#0f172a", "#64748b", "#fafafa"],
  mode: "light" as "light" | "dark" | "auto",
  systemColorScheme: "dark" as "light" | "dark",
  seed: "svgseed",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
  overlayClock: false,
  overlayDate: false,
  overlayText: false,
  overlayTextValue: "",
  overlayFont: "Inter",
  overlaySize: 1,
  customWidth: 400,
  customHeight: 800,
  exportFormat: "svg" as const,
};

vi.mock("@/store/useEditorStore", () => ({
  useEditorStore: {
    getState: () => storeState,
  },
}));

vi.mock("@/lib/generators", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/generators")>();
  return {
    ...actual,
    getGenerator: (id: string) => {
      if (id === "geometric") {
        return { ...geometric, toSvg };
      }
      return actual.getGenerator(id);
    },
  };
});

describe("triggerSingleExport SVG palette resolution", () => {
  beforeEach(() => {
    toSvg.mockClear();
    storeState.mode = "light";
    storeState.systemColorScheme = "dark";
    storeState.exportFormat = "svg";
    vi.stubGlobal("URL", { ...URL, createObjectURL: vi.fn(() => "blob:mock"), revokeObjectURL: vi.fn() });
  });

  it("passes the resolved palette to generator.toSvg", async () => {
    const { triggerSingleExport } = await import("./actions");
    const input = buildRenderInput(storeState, { width: storeState.customWidth, height: storeState.customHeight });
    const expected = resolvePalette(input.palette, input.mode, input.autoMode);

    await triggerSingleExport();

    expect(toSvg).toHaveBeenCalledOnce();
    expect(toSvg).toHaveBeenCalledWith(
      { width: storeState.customWidth, height: storeState.customHeight },
      input.params,
      storeState.seed,
      expected
    );
    expect(expected[0]).toBe("#fafafa");
  });
});
