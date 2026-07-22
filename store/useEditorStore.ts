import { create } from "zustand";
import { getGenerator } from "../lib/generators/registry";
import { hashSeed } from "../lib/prng";

export type Mode = "light" | "dark" | "auto";
export type SystemColorScheme = "light" | "dark";
export type ExportFormat = "png" | "jpg" | "webp" | "svg";

export type EditorState = {
  generatorId: string;
  params: Record<string, unknown>;

  palette: string[];
  mode: Mode;
  systemColorScheme: SystemColorScheme;
  seed: string;

  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;

  // legacy resolutionId + custom size are kept for backward compatibility
  resolutionId: string;
  customWidth: number;
  customHeight: number;
  aspectLock: boolean;

  // Device/Phone picker state
  deviceType: "desktop" | "laptop" | "tablet" | "phone" | "custom";
  phoneBrand?: string;
  phoneModel?: string;
  phoneDisplay?: string; // display id within the phone model
  orientation: "portrait" | "landscape";
  // holds last phone selection when switching to custom/other types
  lastPhoneSelection?: { brand?: string; model?: string; display?: string; orientation?: "portrait" | "landscape" };

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
  setSystemColorScheme: (scheme: SystemColorScheme) => void;
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

  // device picker setters
  setDeviceType: (t: EditorState["deviceType"]) => void;
  setPhoneSelection: (brand?: string, model?: string, display?: string) => void;
  setOrientation: (o: EditorState["orientation"]) => void;

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
  systemColorScheme: "dark",
  seed: "k3p9x2a7",

  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,

  resolutionId: "desktop-1080p",
  customWidth: 1920,
  customHeight: 1080,
  aspectLock: true,

  // device/phone defaults
  deviceType: "desktop",
  phoneBrand: undefined,
  phoneModel: undefined,
  phoneDisplay: undefined,
  orientation: "portrait",
  lastPhoneSelection: undefined,

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
  setSystemColorScheme: (scheme) => set({ systemColorScheme: scheme }),

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

  // device/phone setters
  setDeviceType: (t) => {
    const prev = get();
    if (t === "phone") {
      // restore last phone selection if present
      if (prev.lastPhoneSelection && prev.lastPhoneSelection.model) {
        set({ deviceType: "phone", phoneBrand: prev.lastPhoneSelection.brand, phoneModel: prev.lastPhoneSelection.model, phoneDisplay: prev.lastPhoneSelection.display ?? undefined, orientation: prev.lastPhoneSelection.orientation ?? "portrait" });
      } else {
        set({ deviceType: "phone" });
      }
    } else {
      // save last phone selection then switch
      const last = { brand: prev.phoneBrand, model: prev.phoneModel, display: prev.phoneDisplay, orientation: prev.orientation };
      set({ deviceType: t, lastPhoneSelection: last });
    }
  },
  setPhoneSelection: (brand, model, display) => {
    set({ phoneBrand: brand, phoneModel: model, phoneDisplay: display });
  },
  setOrientation: (o) => set({ orientation: o }),

  hydrate: (next) => set(next as EditorState),
}));

function getDefaultParams(id: string): unknown {
  const g = getGenerator(id);
  return g ? structuredClone(g.schema.defaults) : {};
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
