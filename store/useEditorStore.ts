import { create } from "zustand";
import { getGenerator } from "../lib/generators/registry";
import { hashSeed } from "../lib/prng";

export type Mode = "light" | "dark" | "auto";
export type ExportFormat = "png" | "jpg" | "webp" | "svg";

export type EditorState = {
  generatorId: string;
  params: Record<string, unknown>;

  palette: string[];
  mode: Mode;
  seed: string;

  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;

  resolutionId: string;
  customWidth: number;
  customHeight: number;
  aspectLock: boolean;

  overlayClock: boolean;
  overlayDate: boolean;
  overlayText: boolean;
  overlayTextValue: string;
  overlayFont: string;
  overlaySize: number;

  exportFormat: ExportFormat;

  sheetCollapsed: boolean;
  setSheetCollapsed: (collapsed: boolean) => void;

  setGenerator: (id: string) => void;
  updateParam: (id: string, key: string, value: unknown) => void;
  setPalette: (palette: string[]) => void;
  randomizeSeed: () => void;
  setSeed: (seed: string) => void;
  setMode: (mode: Mode) => void;
  setResolution: (id: string, width: number, height: number) => void;
  setCustomSize: (w: number, h: number) => void;
  setAspectLock: (locked: boolean) => void;
  setGrain: (enabled: boolean, intensity: number) => void;
  setBlur: (v: number) => void;
  setOverlay: (key: "clock" | "date" | "text", value: boolean) => void;
  setOverlayText: (text: string) => void;
  setOverlayFont: (font: string) => void;
  setOverlaySize: (size: number) => void;
  setExportFormat: (f: ExportFormat) => void;
  hydrate: (next: Partial<EditorState>) => void;
};

const SEED_RE = /^[0-9a-z]{1,16}$/;

import { initializeBuiltInGenerators } from "../lib/generators/bootstrap";

initializeBuiltInGenerators();

export const useEditorStore = create<EditorState>((set, get) => ({
  generatorId: "waveform",
  params: { waveform: getDefaultParams("waveform") },

  palette: ["#0f172a", "#f59e0b"],
  mode: "dark",
  seed: "k3p9x2a7",

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
  setSheetCollapsed: (collapsed) => set({ sheetCollapsed: collapsed }),

  setGenerator: (id) => {
    const params = get().params;
    if (!params[id]) {
      set({ generatorId: id, params: { ...params, [id]: getDefaultParams(id) } });
    } else {
      set({ generatorId: id });
    }
  },

  updateParam: (id, key, value) => {
    const current = (get().params[id] ?? {}) as Record<string, unknown>;
    set({ params: { ...get().params, [id]: { ...current, [key]: value } } });
  },

  setPalette: (palette) => set({ palette }),
  randomizeSeed: () => set({ seed: hashSeed(String(Math.random() * 1e9)) }),
  setSeed: (seed) => {
    if (!SEED_RE.test(seed)) return;
    set({ seed });
  },
  setMode: (mode) => set({ mode }),

  setResolution: (id, width, height) => set({ resolutionId: id, customWidth: width, customHeight: height }),
  setCustomSize: (w, h) => set({ customWidth: w, customHeight: h }),
  setAspectLock: (locked) => set({ aspectLock: locked }),

  setGrain: (enabled, intensity) => set({ grainEnabled: enabled, grainIntensity: intensity }),
  setBlur: (v) => set({ blurIntensity: v }),

  setOverlay: (key, value) => set({ [`overlay${capitalize(key)}`]: value } as Partial<EditorState>),
  setOverlayText: (text) => set({ overlayTextValue: text }),
  setOverlayFont: (font) => set({ overlayFont: font }),
  setOverlaySize: (size) => set({ overlaySize: size }),

  setExportFormat: (f) => set({ exportFormat: f }),

  hydrate: (next) => set(next as EditorState),
}));

function getDefaultParams(id: string): unknown {
  const g = getGenerator(id);
  return g ? structuredClone(g.schema.defaults) : {};
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
