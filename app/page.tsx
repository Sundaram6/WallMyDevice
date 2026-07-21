"use client";

import { useEffect, useState } from "react";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { BottomSheet } from "@/components/Preview/BottomSheet";
import { useEditorStore } from "@/store/useEditorStore";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";
import { ensureRegistered, getGenerator } from "@/lib/generators";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { decodeHash } from "@/lib/recipe/encode";
import { getDefaultParams } from "@/lib/generators/registry-helpers";
import { DropZone } from "@/components/DropZone";

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

function persistToLocalStorage() {
  const state = useEditorStore.getState();
  const local = {
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
    overlayClock: state.overlayClock,
    overlayDate: state.overlayDate,
    overlayText: state.overlayText,
    overlayTextValue: state.overlayTextValue,
    overlayFont: state.overlayFont,
    overlaySize: state.overlaySize,
    exportFormat: state.exportFormat,
  };
  try { localStorage.setItem("wallmydevice:lastState", JSON.stringify(local)); } catch {}
}

export default function Page() {
  const generatorId = useEditorStore(s => s.generatorId);
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);

  const [isMobile, setIsMobile] = useState(false);
  const sheetCollapsed = useEditorStore(s => s.sheetCollapsed);
  const setSheetCollapsed = useEditorStore(s => s.setSheetCollapsed);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => { loadHashRecipe(); }, []);

  useEffect(() => { persistToLocalStorage(); });

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const activeFrame = isMobile && (preset.frame === "desktop-monitor" || preset.frame === "ultrawide" || preset.frame === "macbook")
    ? "none"
    : preset.frame;
  const aspect = customWidth / customHeight;
  const generator = getGenerator(generatorId);
  const sheetTitle = `Generator: ${generator?.label ?? generatorId}`;

  if (isMobile) {
    return (
      <DropZone>
        <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
          <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
            <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
          </header>
          <KeyboardShortcuts />
          <main className="relative flex-1 overflow-hidden">
            <div className="flex h-full items-center justify-center p-4">
              <DeviceFrame frame={activeFrame} aspect={aspect}>
                <PreviewCanvas frame={activeFrame} aspect={aspect} maxWidth={360} maxHeight={640} />
              </DeviceFrame>
            </div>
            <BottomSheet title={sheetTitle} collapsed={sheetCollapsed} onSnap={setSheetCollapsed}>
              <ControlPanel />
            </BottomSheet>
          </main>
        </div>
      </DropZone>
    );
  }

  return (
    <DropZone>
      <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
        <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
          <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
          <span className="text-xs text-zinc-500">{generatorId} - {customWidth}x{customHeight}</span>
        </header>
        <KeyboardShortcuts />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex flex-1 items-center justify-center p-6">
            <DeviceFrame frame={preset.frame} aspect={aspect}>
              <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={800} maxHeight={600} />
            </DeviceFrame>
          </main>
          <ControlPanel />
        </div>
      </div>
    </DropZone>
  );
}
