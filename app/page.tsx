"use client";

import { useEffect } from "react";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { useEditorStore } from "@/store/useEditorStore";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";
import { ensureRegistered } from "@/lib/generators";
import { decodeHash } from "@/lib/recipe/encode";

export default function Page() {
  const generatorId = useEditorStore(s => s.generatorId);
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#r=")) {
      const r = decodeHash(hash);
      if (r.ok) {
        const recipe = r.recipe;
        useEditorStore.setState({
          generatorId: recipe.generator,
          params: { ...useEditorStore.getState().params, [recipe.generator]: recipe.params },
          palette: recipe.palette,
          mode: recipe.mode,
          seed: recipe.seed,
          grainEnabled: recipe.grain.enabled,
          grainIntensity: recipe.grain.intensity,
          blurIntensity: recipe.blur,
          resolutionId: recipe.resolution.preset === "custom" ? "custom" : recipe.resolution.preset,
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
    }
  }, []);

  useEffect(() => {
    const state = useEditorStore.getState();
    let params: Record<string, unknown> = state.params;
    try { params = JSON.parse(JSON.stringify(state.params)); } catch {}
    const local = {
      generatorId: state.generatorId,
      params,
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
  });

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const aspect = customWidth / customHeight;
  const maxPreviewWidth = 800;
  const maxPreviewHeight = 600;

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
        <span className="text-xs text-zinc-500">{generatorId} - {customWidth}x{customHeight} - {preset.frame}</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 items-center justify-center p-6">
          <DeviceFrame frame={preset.frame} aspect={aspect}>
            <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={maxPreviewWidth} maxHeight={maxPreviewHeight} />
          </DeviceFrame>
        </main>
        <ControlPanel />
      </div>
    </div>
  );
}
