"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { DEVICE_PRESETS, findPreset } from "@/lib/devices/presets";
import { decodeHash } from "@/lib/recipe/encode";
import { loadLocalState, saveLocalState, type LocalState } from "@/lib/storage/localState";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { CURRENT_VERSION } from "@/lib/changelog/data";
import type { AccessibilityMode } from "@/components/Preview/AccessibilityPreviewBar";
import { parseShareParams, buildShareQueryString } from "@/lib/share/shareUrl";
import { deviceEngine } from "@/lib/engine/DeviceEngine";

function autoDetectDeviceAndModel() {
  if (typeof window === "undefined") return null;

  const ua = navigator.userAgent || "";
  const width = window.innerWidth;
  const height = window.innerHeight;
  const screenW = window.screen?.width || width;
  const screenH = window.screen?.height || height;
  const maxDim = Math.max(screenW, screenH);

  const isMobileUA = /iPhone|Android|Mobile|iPod/i.test(ua);
  const isTabletUA = /iPad|Tablet/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isMobileUA && !isTabletUA) {
    if (/iPhone/i.test(ua)) {
      return {
        deviceType: "phone" as const,
        phoneBrand: "apple",
        phoneModel: maxDim >= 926 ? "iphone-16-pro-max" : "iphone-16-pro",
        resolutionId: "iphone-15-pro",
        customWidth: 1206,
        customHeight: 2622,
        notice: "Auto-detected your iPhone display.",
      };
    }
    if (/Samsung|Galaxy/i.test(ua)) {
      return {
        deviceType: "phone" as const,
        phoneBrand: "samsung",
        phoneModel: "s25-ultra",
        resolutionId: "custom",
        customWidth: 1440,
        customHeight: 3120,
        notice: "Auto-detected your Samsung Galaxy display.",
      };
    }
    return {
      deviceType: "phone" as const,
      phoneBrand: "google",
      phoneModel: "pixel-9-pro-xl",
      resolutionId: "custom",
      customWidth: 1344,
      customHeight: 2992,
      notice: "Auto-detected your mobile display.",
    };
  }

  if (isTabletUA || (width >= 640 && width < 1024)) {
    return {
      deviceType: "tablet" as const,
      phoneBrand: undefined,
      phoneModel: undefined,
      resolutionId: "ipad-pro-13",
      customWidth: 2064,
      customHeight: 2752,
      notice: "Auto-detected your tablet display.",
    };
  }

  if (maxDim >= 2560) {
    return {
      deviceType: "desktop" as const,
      phoneBrand: undefined,
      phoneModel: undefined,
      resolutionId: "desktop-4k",
      customWidth: 3840,
      customHeight: 2160,
      notice: "Auto-detected your 4K desktop display.",
    };
  }

  return {
    deviceType: "desktop" as const,
    phoneBrand: undefined,
    phoneModel: undefined,
    resolutionId: "desktop-1080p",
    customWidth: 1920,
    customHeight: 1080,
    notice: "Auto-detected your desktop display.",
  };
}

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

  const aspect = customWidth && customHeight ? customWidth / customHeight : 16 / 9;

  const [accMode, setAccMode] = useState<AccessibilityMode>("normal");
  const [showContrastGrid, setShowContrastGrid] = useState(false);
  const [deviceNotice, setDeviceNotice] = useState<string | null>(null);
  const [whatsNewBanner, setWhatsNewBanner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      useEditorStore.getState().setSystemColorScheme(mq.matches ? "dark" : "light");
    };
    apply();
    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (window as any).__WMD_STORE__ = useEditorStore;
    (window as any).useEditorStore = useEditorStore;
    (window as any).copyStudioLink = copyStudioLink;

    const shareParams = parseShareParams(window.location.search);
    const hasUrlState = Boolean(shareParams.g || shareParams.s || shareParams.p);

    if (hasUrlState) {
      const store = useEditorStore.getState();
      if (shareParams.g) store.setGenerator(shareParams.g);
      if (shareParams.s) store.setSeed(shareParams.s);
      if (shareParams.p) store.setPalette(shareParams.p);
      if (shareParams.d) store.setDeviceType(shareParams.d as any);
    } else {
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

      restoreFromLocalStorage();
      loadHashRecipe();
    }

    const hasSavedState = Boolean(loadLocalState());

    // Default UI theme setup unless explicitly saved
    if (!hasSavedState && !hasUrlState) {
      if (typeof document !== "undefined") {
        const savedTheme = localStorage.getItem("wmd-theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
      }

      // Auto-detect device model & screen dimensions
      const detected = autoDetectDeviceAndModel();
      if (detected) {
        useEditorStore.setState({
          deviceType: detected.deviceType,
          phoneBrand: detected.phoneBrand,
          phoneModel: detected.phoneModel,
          resolutionId: detected.resolutionId,
          customWidth: detected.customWidth,
          customHeight: detected.customHeight,
        });
        setDeviceNotice(detected.notice);
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

  // URL state sync via history.replaceState
  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncUrl = () => {
      const state = useEditorStore.getState();
      const query = buildShareQueryString(state);
      const targetSearch = query ? `?${query}` : "";
      if (window.location.search !== targetSearch) {
        const newUrl = targetSearch
          ? `${window.location.pathname}${targetSearch}${window.location.hash}`
          : `${window.location.pathname}${window.location.hash}`;
        try {
          window.history.replaceState(window.history.state, "", newUrl);
        } catch (_) {}
      }
    };

    const unsub = useEditorStore.subscribe(syncUrl);
    syncUrl();

    return () => {
      unsub();
    };
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

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (typeof window !== "undefined") {
    (window as any).showToast = (msg: string) => setToastMessage(msg);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleToast = (e: Event) => {
      const custom = e as CustomEvent<{ message: string }>;
      if (custom.detail?.message) {
        setToastMessage(custom.detail.message);
      }
    };
    window.addEventListener("wmd-toast", handleToast);
    return () => window.removeEventListener("wmd-toast", handleToast);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  return {
    generatorId,
    resolutionId,
    customWidth,
    customHeight,
    deviceType,
    phoneModel,
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
    toastMessage,
    setToastMessage,
    showToast,
  };
}
