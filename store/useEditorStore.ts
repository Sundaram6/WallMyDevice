import { create } from "zustand";
import { getGenerator, listGenerators, getDefaultParams } from "../lib/generators/registry";
import { hashSeed } from "../lib/prng";
import { ARCHIVE_PRESETS } from "../lib/presets/archive-presets";
import { editorCore } from "../lib/engine/EditorCore";
import { parseShareParams, syncStateToUrl } from "../lib/share/shareUrl";
import { getRandomCombo, getRemixCombo, getRandomPalette, getRandomSeed } from "../lib/randomization";

export type Mode = "light" | "dark" | "auto";
export type SystemColorScheme = "light" | "dark";
export type ExportFormat = "png" | "svg" | "jpg" | "webp";
export type SheetSnap = "peek" | "control" | "full";

export type PhoneSelection = {
  brand?: string;
  model?: string;
  display?: string;
  orientation?: "portrait" | "landscape";
};

export type EditorState = {
  generatorId: string;
  // Map generatorId -> params object
  params: Record<string, unknown>;

  palette: string[];
  mode: Mode;
  systemColorScheme: SystemColorScheme;
  seed: string;

  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;

  // resolution / aspect
  resolutionId: string;
  customWidth: number;
  customHeight: number;
  aspectLock: boolean;

  // device / phone customization
  deviceType: "desktop" | "laptop" | "tablet" | "phone" | "custom";
  phoneBrand?: string;
  phoneModel?: string;
  phoneDisplay?: string;
  orientation: "portrait" | "landscape";
  lastPhoneSelection?: PhoneSelection;

  // overlays
  overlayClock: boolean;
  overlayDate: boolean;
  overlayText: boolean;
  overlayTextValue: string;
  overlayFont: string;
  overlaySize: number;

  exportFormat: ExportFormat;

  sheetSnap: SheetSnap;
  setSheetSnap: (snap: SheetSnap) => void;

  isInteracting: boolean;
  setInteracting: (isInteracting: boolean) => void;

  setGenerator: (id: string) => void;
  updateParam: (id: string, key: string, value: unknown) => void;

  paletteLocked: boolean;
  seedLocked: boolean;
  togglePaletteLock: () => void;
  toggleSeedLock: () => void;
  randomizePalette: () => void;
  surpriseMe: () => void;
  remix: () => void;

  setPalette: (palette: string[]) => void;
  randomizeSeed: () => void;
  setSeed: (seed: string) => void;
  setMode: (mode: Mode) => void;
  setSystemColorScheme: (scheme: SystemColorScheme) => void;

  setResolution: (id: string, width: number, height: number) => void;
  setCustomSize: (width: number, height: number) => void;
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

  historyVersion: number;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
  undo: () => void;
  redo: () => void;

  hydrate: (next: Partial<EditorState>) => void;
};

const SEED_RE = /^[0-9a-z]{1,16}$/;

import { initializeBuiltInGenerators } from "../lib/generators/bootstrap";

initializeBuiltInGenerators();

const initialShareParams = typeof window !== "undefined" ? parseShareParams(window.location.search) : {};
const initialGenId = initialShareParams.g || "waveform";

function recordSnapshot(state: EditorState, label: string) {
  editorCore.history.pushSnapshot(label, state);
}

export const useEditorStore = create<EditorState>((set, get) => ({
  generatorId: initialGenId,
  params: { [initialGenId]: getDefaultParams(initialGenId) },

  palette: initialShareParams.p || (initialGenId === "typography" ? ["#080711", "#240046", "#FF007F", "#00F0FF", "#FFE600"] : ["#0f172a", "#f59e0b"]),
  mode: initialGenId === "typography" ? "dark" : "light",
  systemColorScheme: "light",
  seed: initialShareParams.s || (initialGenId === "typography" ? "12m8twlk" : "k3p9x2a7"),

  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,

  resolutionId: "desktop-1080p",
  customWidth: 1920,
  customHeight: 1080,
  aspectLock: true,

  // device/phone defaults
  deviceType: (initialShareParams.d as any) || "desktop",
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

  sheetSnap: "peek",
  setSheetSnap: (snap) => set({ sheetSnap: snap }),

  isInteracting: false,
  setInteracting: (isInteracting) => set({ isInteracting }),

  historyVersion: 0,

  setGenerator: (id) => {
    const currentState = get();
    if (currentState.generatorId === id) return;
    recordSnapshot(currentState, `Set Generator: ${id}`);

    const params = currentState.params;
    if (id === "typography") {
      set({
        generatorId: id,
        seed: "12m8twlk",
        palette: ["#080711", "#240046", "#FF007F", "#00F0FF", "#FFE600"],
        mode: "dark",
        params: { ...params, [id]: { text: "WallMyDevice", font: "JetBrains Mono", size: 0.4, weight: 700, letterSpacing: 0, alignment: "center" } },
        historyVersion: get().historyVersion + 1,
      });
      return;
    }

    if (!params[id]) {
      set({
        generatorId: id,
        params: { ...params, [id]: getDefaultParams(id) },
        historyVersion: get().historyVersion + 1,
      });
    } else {
      set({ generatorId: id, historyVersion: get().historyVersion + 1 });
    }
  },

  updateParam: (id, key, value) => {
    const currentState = get();
    const currentParams = (currentState.params[id] ?? {}) as Record<string, unknown>;
    if (currentParams[key] === value) return;

    recordSnapshot(currentState, `Update ${key}`);
    set({
      params: { ...currentState.params, [id]: { ...currentParams, [key]: value } },
      historyVersion: get().historyVersion + 1,
    });
  },

  paletteLocked: false,
  seedLocked: false,
  togglePaletteLock: () => set((s) => ({ paletteLocked: !s.paletteLocked })),
  toggleSeedLock: () => set((s) => ({ seedLocked: !s.seedLocked })),

  randomizePalette: () => {
    const currentState = get();
    recordSnapshot(currentState, "Randomize Palette");
    set({ palette: getRandomPalette(), historyVersion: get().historyVersion + 1 });
  },

  surpriseMe: () => {
    const state = get();
    recordSnapshot(state, "Surprise Me");
    const combo = getRandomCombo(state.generatorId);
    const updates: Partial<EditorState> = {
      historyVersion: get().historyVersion + 1,
    };

    if (combo.generatorId !== state.generatorId) {
      updates.generatorId = combo.generatorId;
      if (!state.params[combo.generatorId]) {
        updates.params = { ...state.params, [combo.generatorId]: combo.params };
      }
    }
    if (!state.seedLocked) {
      updates.seed = combo.seed;
    }
    if (!state.paletteLocked) {
      updates.palette = combo.palette;
    }
    set(updates);
  },

  remix: () => {
    const state = get();
    recordSnapshot(state, "Remix");
    const combo = getRemixCombo(state.generatorId);
    const updates: Partial<EditorState> = {
      historyVersion: get().historyVersion + 1,
    };

    if (!state.seedLocked) {
      updates.seed = combo.seed;
    }
    if (!state.paletteLocked) {
      updates.palette = combo.palette;
    }
    set(updates);
  },

  setPalette: (palette) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Palette");
    set({ palette, historyVersion: get().historyVersion + 1 });
  },

  randomizeSeed: () => {
    const currentState = get();
    recordSnapshot(currentState, "Randomize Seed");
    set({ seed: getRandomSeed(), historyVersion: get().historyVersion + 1 });
  },

  setSeed: (seed) => {
    if (!SEED_RE.test(seed)) return;
    const currentState = get();
    if (currentState.seed === seed) return;
    recordSnapshot(currentState, "Set Seed");
    set({ seed, historyVersion: get().historyVersion + 1 });
  },

  setMode: (mode) => {
    const currentState = get();
    if (currentState.mode === mode) return;
    recordSnapshot(currentState, `Set Mode: ${mode}`);
    set({ mode, historyVersion: get().historyVersion + 1 });
  },

  setSystemColorScheme: (scheme) => set({ systemColorScheme: scheme }),

  setResolution: (id, width, height) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Resolution");
    set({ resolutionId: id, customWidth: width, customHeight: height, historyVersion: get().historyVersion + 1 });
  },

  setCustomSize: (w, h) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Custom Size");
    set({ customWidth: w, customHeight: h, historyVersion: get().historyVersion + 1 });
  },

  setAspectLock: (locked) => set({ aspectLock: locked }),

  setGrain: (enabled, intensity) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Grain");
    set({ grainEnabled: enabled, grainIntensity: intensity, historyVersion: get().historyVersion + 1 });
  },

  setBlur: (v) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Blur");
    set({ blurIntensity: v, historyVersion: get().historyVersion + 1 });
  },

  setOverlay: (key, value) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Overlay");
    set({ [`overlay${capitalize(key)}`]: value, historyVersion: get().historyVersion + 1 } as Partial<EditorState>);
  },

  setOverlayText: (text) => set({ overlayTextValue: text }),
  setOverlayFont: (font) => set({ overlayFont: font }),
  setOverlaySize: (size) => set({ overlaySize: size }),

  setExportFormat: (f) => set({ exportFormat: f }),

  setDeviceType: (t) => {
    const prev = get();
    recordSnapshot(prev, "Set Device Type");
    if (t === "phone") {
      if (prev.lastPhoneSelection && prev.lastPhoneSelection.model) {
        set({ deviceType: "phone", phoneBrand: prev.lastPhoneSelection.brand, phoneModel: prev.lastPhoneSelection.model, phoneDisplay: prev.lastPhoneSelection.display ?? undefined, orientation: prev.lastPhoneSelection.orientation ?? "portrait", historyVersion: get().historyVersion + 1 });
      } else {
        set({ deviceType: "phone", historyVersion: get().historyVersion + 1 });
      }
    } else {
      const last = { brand: prev.phoneBrand, model: prev.phoneModel, display: prev.phoneDisplay, orientation: prev.orientation };
      set({ deviceType: t, lastPhoneSelection: last, historyVersion: get().historyVersion + 1 });
    }
  },

  setPhoneSelection: (brand, model, display) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Phone");
    set({ phoneBrand: brand, phoneModel: model, phoneDisplay: display, historyVersion: get().historyVersion + 1 });
  },

  setOrientation: (o) => {
    const currentState = get();
    recordSnapshot(currentState, "Set Orientation");
    set({ orientation: o, historyVersion: get().historyVersion + 1 });
  },

  reset: () => {
    const state = get();
    recordSnapshot(state, "Reset Defaults");
    const gId = state.generatorId;
    const defaultParams = getDefaultParams(gId);
    set({
      params: { ...state.params, [gId]: defaultParams },
      palette: ["#0f172a", "#f59e0b"],
      seed: "k3p9x2a7",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      historyVersion: get().historyVersion + 1,
    });
  },

  canUndo: () => editorCore.history.canUndo(),
  canRedo: () => editorCore.history.canRedo(),

  undo: () => {
    const currentState = get();
    const prev = editorCore.history.undo(currentState);
    if (prev) {
      set({ ...prev, historyVersion: get().historyVersion + 1 });
    }
  },

  redo: () => {
    const currentState = get();
    const next = editorCore.history.redo(currentState);
    if (next) {
      set({ ...next, historyVersion: get().historyVersion + 1 });
    }
  },

  hydrate: (next) => set(next as EditorState),
}));

if (typeof window !== "undefined") {
  (window as any).__WMD_STORE__ = useEditorStore;
  (window as any).useEditorStore = useEditorStore;
  useEditorStore.subscribe((state) => {
    syncStateToUrl(state);
  });
  syncStateToUrl(useEditorStore.getState());
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
