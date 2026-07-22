import React, { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { DEVICE_PRESETS, findPreset } from "@/lib/devices/presets";
import { PHONE_CATALOGUE } from "@/lib/devices/presets";
import { CURATED_PALETTES } from "@/lib/palettes/data";
import { listGenerators } from "@/lib/generators";
import { triggerSingleExport } from "@/lib/export/actions";
import { ResolutionPicker } from "@/components/Panel/ResolutionPicker";

const MOOD_OPTIONS = [
  { id: "calm", label: "Calm", palette: ["#6E7A5C", "#E4DCC8", "#2F4A5C", "#C79A66", "#C77A5E"], mode: "light" },
  { id: "warm", label: "Warm", palette: ["#5A2411", "#C9552F", "#F0B27A", "#2B2A26", "#E4DCC8"], mode: "light" },
  { id: "bold", label: "Bold", palette: ["#101820", "#1F3A5F", "#3E6E9E", "#D4CDBC", "#C9552F"], mode: "dark" },
  { id: "organic", label: "Organic", palette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26", "#5C6E4E"], mode: "light" },
  { id: "minimal", label: "Minimal", palette: ["#FAF8F4", "#5B584F", "#2B2A26", "#8A8579", "#D4CDBC"], mode: "light" },
  { id: "vintage", label: "Vintage", palette: ["#E4DCC8", "#C79A66", "#8A8579", "#2F4A5C", "#4B5A6E"], mode: "light" },
  { id: "playful", label: "Playful", palette: ["#F3DDD1", "#C9552F", "#5A2411", "#FAF8F4", "#3E6E9E"], mode: "light" },
] as const;

type Props = {
  onOpenStudio?: () => void;
};

export function QuickGeneratePanel({ onOpenStudio }: Props) {
  const store = useEditorStore();
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [activeMood, setActiveMood] = useState<string>("calm");
  const [resolutionScale, setResolutionScale] = useState<"1x" | "2x" | "3x" | "custom">("1x");

  const generators = listGenerators();

  // Resolution handling
  const activePreset = findPreset(store.resolutionId) ?? DEVICE_PRESETS[0];
  const baseWidth = store.customWidth || activePreset.w;
  const baseHeight = store.customHeight || activePreset.h;

  const currentScale = resolutionScale === "2x" ? 2 : resolutionScale === "3x" ? 3 : 1;
  const targetW = baseWidth * currentScale;
  const targetH = baseHeight * currentScale;

  const handleMoodSelect = (moodId: string) => {
    setActiveMood(moodId);
    const mood = MOOD_OPTIONS.find(m => m.id === moodId);
    if (mood) {
      store.setPalette([...mood.palette]);
      store.setMode(mood.mode as any);
    }
  };

  const handleShufflePalette = () => {
    const randomPal = CURATED_PALETTES[Math.floor(Math.random() * CURATED_PALETTES.length)];
    if (randomPal) {
      store.setPalette(randomPal.colors);
    }
  };

  const handleGenerate = () => {
    store.randomizeSeed();
  };

  const handleSaveRecipe = () => {
    triggerSingleExport({ width: targetW, height: targetH });
  };

  const handleCustomScaleClick = () => {
    setResolutionScale("custom");
    store.setResolution("custom", store.customWidth, store.customHeight);
  };

  return (
    <aside className="w-[340px] shrink-0 border-l border-[#E4DFD3] bg-[#FAF8F4] p-7">
      <div className="flex items-center gap-2 font-serif text-lg font-medium text-[#2B2A26]">
        <span className="text-[#C9552F]">✦</span> Generate Wallpaper
      </div>

      <div className="mt-6 flex flex-col gap-5 text-xs">
        {/* Device Picker */}
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
            Device
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDevicePicker(!showDevicePicker)}
              className="flex w-full items-center gap-3 rounded-lg border border-[#D4CDBC] bg-white p-3 text-left shadow-sm hover:border-[#C9552F]"
            >
              <div className="h-8 w-8 rounded-md bg-[#2B2A26]" />
              <div className="flex-1 min-w-0">
                <b className="block text-sm font-medium text-[#2B2A26] truncate">
                  {store.deviceType === "phone" && store.phoneModel
                    ? (PHONE_CATALOGUE.find(p => p.id === store.phoneModel)?.name ?? "Phone")
                    : activePreset.label}
                </b>
                <span className="font-mono text-[10px] text-[#8A8579]">
                  {targetW} × {targetH} px
                </span>
              </div>
              <span className="text-[#8A8579]">⌄</span>
            </button>

            {showDevicePicker && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-[#D4CDBC] bg-white p-3 shadow-lg">
                <ResolutionPicker />
              </div>
            )}
          </div>
        </div>

        {/* Generator Picker */}
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
            Generator
          </label>
          <select
            value={store.generatorId}
            onChange={(e) => store.setGenerator(e.target.value)}
            className="w-full rounded-lg border border-[#D4CDBC] bg-white px-3 py-2.5 text-xs text-[#2B2A26] focus:border-[#C9552F] focus:outline-none"
          >
            {generators.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label} — {g.description ?? "Pattern generator"}
              </option>
            ))}
          </select>
        </div>

        {/* Palette & Shuffle */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
              Palette
            </label>
            <button
              type="button"
              onClick={handleShufflePalette}
              className="flex items-center gap-1 font-mono text-[10.5px] text-[#5B584F] hover:text-[#C9552F]"
            >
              ⤨ Shuffle
            </button>
          </div>
          <div className="flex items-center gap-2">
            {store.palette.slice(0, 5).map((col, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: col }}
                className="h-8 w-8 rounded-md border border-black/10 shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Mood Options */}
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
            Mood (optional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {MOOD_OPTIONS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleMoodSelect(m.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition ${
                  activeMood === m.id
                    ? "border-[#2B2A26] bg-[#2B2A26] text-white"
                    : "border-[#D4CDBC] bg-white text-[#5B584F] hover:border-[#8A8579]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Scale */}
        <div>
          <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#8A8579]">
            Resolution Scale
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(["1x", "2x", "3x", "custom"] as const).map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => scale === "custom" ? handleCustomScaleClick() : setResolutionScale(scale)}
                className={`rounded-lg border p-2 text-center transition ${
                  resolutionScale === scale
                    ? "border-[#2B2A26] bg-[#F3EFE6] text-[#2B2A26]"
                    : "border-[#D4CDBC] bg-white text-[#5B584F] hover:border-[#8A8579]"
                }`}
              >
                <b className="block text-xs">{scale}</b>
                <span className="font-mono text-[9px] text-[#8A8579]">
                  {scale === "1x" ? "100%" : scale === "2x" ? "200%" : scale === "3x" ? "300%" : "custom"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Device Summary */}
        <div className="flex items-center gap-3 rounded-lg border border-[#D4CDBC] bg-[#F3EFE6] p-3">
          <div className="h-[36px] w-[36px] rounded-lg border border-[#D4CDBC] bg-white" />
          <div>
            <b className="block text-xs font-medium text-[#2B2A26]">{activePreset.label}</b>
            <span className="font-mono text-[10.5px] text-[#8A8579]">
              {targetW} × {targetH} px · 19.5:9
            </span>
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={handleGenerate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2B2A26] py-3.5 text-sm font-medium text-white shadow transition hover:bg-[#1a1917]"
        >
          Generate Wallpaper ✦
        </button>

        {/* Secondary Export Action */}
        <button
          type="button"
          onClick={handleSaveRecipe}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4CDBC] bg-white py-3 text-xs font-medium text-[#5B584F] shadow-sm transition hover:bg-[#FAF8F4]"
        >
          ⛁ Export Wallpaper
        </button>

        {onOpenStudio && (
          <button
            type="button"
            onClick={onOpenStudio}
            className="w-full text-center text-xs font-medium text-[#C9552F] underline underline-offset-4"
          >
            Open in Studio Editor →
          </button>
        )}

        <p className="text-center font-sans text-[11px] text-[#8A8579]">
          All wallpapers are created for personal use only.
        </p>
      </div>
    </aside>
  );
}
