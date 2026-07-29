"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { DEVICE_PRESETS, findPreset } from "@/lib/devices/presets";
import { decodeHash } from "@/lib/recipe/encode";
import { loadLocalState, saveLocalState, type LocalState } from "@/lib/storage/localState";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { CURRENT_VERSION } from "@/lib/changelog/data";
import type { AccessibilityMode } from "@/components/Preview/AccessibilityPreviewBar";

function restoreFromLocalStorage() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (hash.startsWith("#r=")) return;
  const saved = loadLocalState();
  if (!saved) return;
  useEditorStore.setState(saved);
}

function loadHashRecipe() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash;
  if (!hash.startsWith("#r=")) return;
  const r = decodeHash(hash);
  if (!r.ok) return;
  const recipe = r.recipe;
  const params = useEditorStore.getState().params;
  useEditorStore.setState({
    generatorId: recipe.generator,
    params: { ...params, [recipe.generator]: recipe.params },
    palette: recipe.palette,
    mode: recipe.mode,
    seed: recipe.seed,
    grainEnabled: recipe.grain.enabled,
    grainIntensity: recipe.grain.intensity,
    blurIntensity: recipe.blur,
    resolutionId: DEVICE_PRESETS.find((p) => p.id === recipe.resolution.preset) ? recipe.resolution.preset : "custom",
    customWidth: recipe.resolution.width,
    customHeight: recipe.resolution.height,
    overlayClock: recipe.overlays.clock,
    overlayDate: recipe.overlays.date,
    overlayText: recipe.overlays.text,
    overlayTextValue: recipe.overlays.value,
    overlayFont: recipe.overlays.font,
    overlaySize: recipe.overlays.size,
  });
}

function snapshotLocalState(): LocalState {
  const state = useEditorStore.getState();
  return {
    generatorId: state.generatorId,
    params: state.params,
    palette: state.palette,
    mode: state.mode,
    seed: state.seed,
    grainEnabled: state.grainEnabled,
    grainIntensity: state.grainIntensity,
    blurIntensity: state.blurIntensity,
    resolutionId: state.resolutionId,
    customWidth: state.customWidth,
    customHeight: state.customHeight,
    aspectLock: state.aspectLock,
    deviceType: (state as any).deviceType,
    phoneBrand: (state as any).phoneBrand,
    phoneModel: (state as any).phoneModel,
    phoneDisplay: (state as any).phoneDisplay,
    orientation: (state as any).orientation,
    overlayClock: state.overlayClock,
    overlayDate: state.overlayDate,
    overlayText: state.overlayText,
    overlayTextValue: state.overlayTextValue,
    overlayFont: state.overlayFont,
    overlaySize: state.overlaySize,
    exportFormat: state.exportFormat,
  };
}

export function useStudioCore() {
  const generatorId = useEditorStore((s) => s.generatorId);
  const resolutionId = useEditorStore((s) => s.resolutionId);
  const customWidth = useEditorStore((s) => s.customWidth);
  const customHeight = useEditorStore((s) => s.customHeight);
  const deviceType = useEditorStore((s) => s.deviceType);
  const phoneModel = useEditorStore((s) => s.phoneModel);

  const sheetCollapsed = useEditorStore((s) => s.sheetCollapsed);
  const setSheetCollapsed = useEditorStore((s) => s.setSheetCollapsed);

  const [accMode, setAccMode] = useState<AccessibilityMode>("normal");
  const [showContrastGrid, setShowContrastGrid] = useState(false);
  const [deviceNotice, setDeviceNotice] = useState<string | null>(null);
  const [whatsNewBanner, setWhatsNewBanner] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      useEditorStore.getState().setSystemColorScheme(mq.matches ? "dark" : "light");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const recipeParam = params.get("recipe");

    if (recipeParam) {
      const swatch = ARCHIVE_PRESETS.find((p) => p.id === recipeParam);
      if (swatch) {
        const store = useEditorStore.getState();
        store.setGenerator(swatch.generatorId);
        store.setPalette([...swatch.palette]);
        store.setMode(swatch.mode);
        store.setSeed(swatch.seed);
        Object.entries(swatch.params).forEach(([key, val]) => {
          store.updateParam(swatch.generatorId, key, val);
        });
      }
    }

    const hasSavedState = Boolean(loadLocalState());
    restoreFromLocalStorage();
    loadHashRecipe();

    if (!hasSavedState) {
      const width = window.innerWidth;
      if (width < 640) {
        useEditorStore.setState({
          deviceType: "phone",
          phoneBrand: "apple",
          phoneModel: "iphone-16-pro",
          resolutionId: "iphone-15-pro",
          customWidth: 1206,
          customHeight: 2622,
        });
        setDeviceNotice("Started with a phone-sized canvas based on this screen.");
      } else if (width >= 640 && width < 1024) {
        useEditorStore.setState({
          deviceType: "tablet",
          resolutionId: "ipad-air-11",
          customWidth: 1640,
          customHeight: 2360,
        });
        setDeviceNotice("Started with a tablet-sized canvas based on this screen.");
      }
    }

    const LAST_SEEN_KEY = "wallmydevice:last_seen_version";
    const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
    if (lastSeen !== CURRENT_VERSION) {
      setWhatsNewBanner(`WallMyDevice ${CURRENT_VERSION} is now live with 4 variations & multi-device export packs!`);
    }

    const handleHash = () => {
      loadHashRecipe();
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const flush = () => saveLocalState(snapshotLocalState());
    const unsub = useEditorStore.subscribe(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(flush, 400);
    });
    return () => {
      if (timeout) clearTimeout(timeout);
      unsub();
    };
  }, []);

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const aspect = customWidth / customHeight;

  return {
    generatorId,
    resolutionId,
    customWidth,
    customHeight,
    deviceType,
    phoneModel,
    preset,
    aspect,
    sheetCollapsed,
    setSheetCollapsed,
    accMode,
    setAccMode,
    showContrastGrid,
    setShowContrastGrid,
    deviceNotice,
    setDeviceNotice,
    whatsNewBanner,
    setWhatsNewBanner,
  };
}
