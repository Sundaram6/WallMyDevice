"use client";

import { useEffect, useState } from "react";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { BottomSheet } from "@/components/Preview/BottomSheet";
import { useEditorStore } from "@/store/useEditorStore";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { decodeHash } from "@/lib/recipe/encode";
import { DropZone } from "@/components/DropZone";
import { loadLocalState, saveLocalState, type LocalState } from "@/lib/storage/localState";

import { ArchiveShell } from "@/components/archive/ArchiveShell";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { CURRENT_VERSION } from "@/lib/changelog/data";
import {
  AccessibilityPreviewBar,
  getAccessibilityFilterStyle,
  type AccessibilityMode,
} from "@/components/Preview/AccessibilityPreviewBar";

function restoreFromLocalStorage() {
  const hash = window.location.hash;
  if (hash.startsWith("#r=")) return;
  const saved = loadLocalState();
  if (!saved) return;
  useEditorStore.setState(saved);
}

function loadHashRecipe() {
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
    resolutionId: DEVICE_PRESETS.find(p => p.id === recipe.resolution.preset) ? recipe.resolution.preset : "custom",
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

export default function Page() {
  const [tab, setTab] = useState<"archive" | "studio">("archive");

  const generatorId = useEditorStore(s => s.generatorId);
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);
  const deviceType = useEditorStore(s => s.deviceType);
  const phoneModel = useEditorStore(s => s.phoneModel);

  const sheetCollapsed = useEditorStore(s => s.sheetCollapsed);
  const setSheetCollapsed = useEditorStore(s => s.setSheetCollapsed);

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
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get("view");
    const recipeParam = params.get("recipe");

    if (viewParam === "studio" || window.location.hash.startsWith("#r=")) {
      setTab("studio");
    }

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

    // If first visit (no saved state in localStorage), select safe device preset based on viewport size
    if (!hasSavedState && typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        // Phone-like viewport -> default to iPhone 16 Pro
        useEditorStore.setState({
          deviceType: "phone",
          phoneBrand: "apple",
          phoneModel: "iphone-16-pro",
          resolutionId: "iphone-15-pro",
          customWidth: 1206,
          customHeight: 2622,
        });
      } else if (width >= 640 && width < 1024) {
        // Tablet-like viewport -> default to iPad Air 11"
        useEditorStore.setState({
          deviceType: "tablet",
          resolutionId: "ipad-air-11",
          customWidth: 1640,
          customHeight: 2360,
        });
      }
    }

    const handleHash = () => {
      if (window.location.hash.startsWith("#r=")) {
        setTab("studio");
      }
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

  const [accMode, setAccMode] = useState<AccessibilityMode>("normal");
  const [showContrastGrid, setShowContrastGrid] = useState(false);
  const [deviceNotice, setDeviceNotice] = useState<string | null>(null);

  const [whatsNewBanner, setWhatsNewBanner] = useState<string | null>(null);

  useEffect(() => {
    const hasSavedState = Boolean(loadLocalState());
    if (!hasSavedState && typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceNotice("Started with a phone-sized canvas based on this screen.");
      } else if (width >= 640 && width < 1024) {
        setDeviceNotice("Started with a tablet-sized canvas based on this screen.");
      }
    }

    if (typeof window !== "undefined") {
      const LAST_SEEN_KEY = "wallmydevice:last_seen_version";
      const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
      if (lastSeen !== CURRENT_VERSION) {
        setWhatsNewBanner(`WallMyDevice ${CURRENT_VERSION} is now live with 4 variations & multi-device export packs!`);
      }
    }
  }, []);

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const aspect = customWidth / customHeight;

  const studioView = (
    <DropZone>
      <div className="relative flex h-[calc(100dvh-72px)] w-full flex-col bg-[#F3EFE6] text-[#2B2A26]">
        <KeyboardShortcuts />
        <div className="flex flex-col sm:flex-row h-auto sm:h-10 shrink-0 items-start sm:items-center justify-between border-b border-[#D4CDBC] bg-[#E4DFD3]/40 px-4 py-2 sm:py-0 text-xs gap-2">
          <span className="font-mono text-[#5B584F]">{generatorId} — {customWidth}×{customHeight}</span>
          <div className="flex flex-wrap items-center gap-2">
            {whatsNewBanner && (
              <div className="flex items-center gap-2 rounded bg-[#C9552F]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#C9552F] border border-[#C9552F]/30">
                <span>✦ {whatsNewBanner}</span>
                <Link href="/changelog" className="underline hover:text-[#2B2A26]">Read Changelog</Link>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("wallmydevice:last_seen_version", CURRENT_VERSION);
                    setWhatsNewBanner(null);
                  }}
                  className="text-[#8A8579] hover:text-[#2B2A26]"
                >
                  ✕
                </button>
              </div>
            )}
            {deviceNotice && (
              <div className="flex items-center gap-2 rounded bg-white/80 px-2 py-0.5 font-mono text-[10.5px] text-[#2B2A26] border border-[#D4CDBC]">
                <span>📱 {deviceNotice}</span>
                <button type="button" onClick={() => setDeviceNotice(null)} className="text-[#8A8579] hover:text-[#2B2A26]">✕</button>
              </div>
            )}
          </div>
        </div>
        <div className="p-3 bg-[#FAF8F4] border-b border-[#E4DFD3]">
          <AccessibilityPreviewBar
            mode={accMode}
            onModeChange={setAccMode}
            showContrastGrid={showContrastGrid}
            onContrastGridToggle={setShowContrastGrid}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden w-full md:grid md:grid-cols-[minmax(0,1fr)_384px]">
          <main className="flex flex-1 items-center justify-center p-4 md:p-8 min-h-[240px] overflow-auto pb-20 md:pb-8">
            <div style={getAccessibilityFilterStyle(accMode)} className="transition-all">
              <DeviceFrame frame={preset.frame} aspect={aspect} deviceType={deviceType} phoneModel={phoneModel}>
                <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={1100} maxHeight={900} />
              </DeviceFrame>
            </div>
          </main>
          <ControlPanel />
        </div>
        <div className="md:hidden">
          <BottomSheet title="Studio Editor" collapsed={sheetCollapsed} onSnap={setSheetCollapsed}>
            <ControlPanel variant="sheet" />
          </BottomSheet>
        </div>
      </div>
    </DropZone>
  );

  return (
    <ArchiveShell currentTab={tab} onTabChange={setTab} childrenStudio={studioView} />
  );
}
