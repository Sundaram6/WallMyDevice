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
    const hash = window.location.hash;
    if (hash.startsWith("#r=")) {
      setTab("studio");
    }
    restoreFromLocalStorage();
    loadHashRecipe();
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

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const aspect = customWidth / customHeight;

  const studioView = (
    <DropZone>
      <div className="relative flex h-full w-full flex-col bg-[#F3EFE6] text-[#2B2A26]">
        <KeyboardShortcuts />
        <div className="flex h-10 items-[#2B2A26] justify-between border-b border-[#D4CDBC] bg-[#E4DFD3]/40 px-4 text-xs">
          <span className="font-mono text-[#5B584F]">{generatorId} - {customWidth}x{customHeight}</span>
        </div>
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <main className="flex flex-1 items-center justify-center p-4 md:p-6 min-h-[300px]">
            <DeviceFrame frame={preset.frame} aspect={aspect} deviceType={deviceType} phoneModel={phoneModel}>
              <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={800} maxHeight={600} />
            </DeviceFrame>
          </main>
          <ControlPanel />
        </div>
        <div className="md:hidden">
          <BottomSheet title="Editor" collapsed={sheetCollapsed} onSnap={setSheetCollapsed}>
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
