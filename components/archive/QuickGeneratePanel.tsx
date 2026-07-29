import React, { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { DEVICE_PRESETS, findPreset } from "@/lib/devices/presets";
import { PHONE_CATALOGUE } from "@/lib/devices/presets";
import { CURATED_PALETTES } from "@/lib/palettes/data";
import { listGenerators } from "@/lib/generators";
import { triggerSingleExport } from "@/lib/export/actions";
import { deriveFourVariations } from "@/lib/export/variations";
import { ResolutionPicker } from "@/components/Panel/ResolutionPicker";
import { MiniPreviewCanvas } from "./MiniPreviewCanvas";

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
  variant?: "desktop" | "mobile";
  hideHeading?: boolean;
};

export function QuickGeneratePanel({ onOpenStudio, variant = "desktop", hideHeading = false }: Props) {
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    store.randomizeSeed();
    try {
      import("@/lib/storage/library").then((m) => {
        const state = store;
        m.addRecentlyGenerated({
          name: `Generated Wallpaper`,
          generatorId: state.generatorId,
          palette: [...state.palette],
          mode: state.mode,
          seed: state.seed,
          params: { ...state.params },
        });
      });
    } catch {}

    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  };

  const handleSaveRecipe = async () => {
    if (exportStatus) return;
    try {
      await triggerSingleExport({ width: targetW, height: targetH }, (msg) => {
        setExportStatus(msg);
      });
    } catch (e) {
    } finally {
      setTimeout(() => setExportStatus(null), 2500);
    }
  };

  const handleCustomScaleClick = () => {
    setResolutionScale("custom");
    store.setResolution("custom", store.customWidth, store.customHeight);
  };

  const isMobile = variant === "mobile";

  return (
    <aside className={isMobile ? "w-full p-4" : "w-[340px] shrink-0 border-l border-brand-border bg-brand-bg p-7"}>
      {!hideHeading && (
        <div className="flex items-center gap-2 font-serif text-lg font-medium text-brand-ink">
          <span className="text-brand-accent">✦</span> Generate Wallpaper
        </div>
      )}

      <div className={`${!hideHeading ? "mt-6" : ""} flex flex-col gap-4 text-xs`}>
        {/* Device Picker */}
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-brand-muted">
            Device
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDevicePicker(!showDevicePicker)}
              className="flex w-full items-center gap-3 rounded-lg border border-brand-border bg-brand-surface-2 p-3 text-left shadow-xs hover:border-brand-accent"
            >
              <div className="h-8 w-8 rounded-md bg-brand-ink shrink-0" />
              <div className="flex-1 min-w-0">
                <b className="block text-sm font-medium text-brand-ink truncate">
                  {store.deviceType === "phone" && store.phoneModel
                    ? (PHONE_CATALOGUE.find(p => p.id === store.phoneModel)?.name ?? "Phone")
                    : activePreset.label}
                </b>
                <span className="font-mono text-[10px] text-brand-muted">
                  {targetW} × {targetH} px
                </span>
              </div>
              <span className="text-brand-muted">⌄</span>
            </button>

            {showDevicePicker && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-brand-border bg-brand-surface-2 p-3 shadow-lg max-h-60 overflow-y-auto">
                <ResolutionPicker />
              </div>
            )}
          </div>
        </div>

        {/* Generator Picker */}
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-brand-muted">
            Generator
          </label>
          <select
            value={store.generatorId}
            onChange={(e) => store.setGenerator(e.target.value)}
            className="w-full rounded-lg border border-brand-border bg-brand-surface-2 px-3 py-2.5 text-xs text-brand-ink focus:border-brand-accent focus:outline-none"
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-brand-muted">
              Palette
            </label>
            <button
              type="button"
              onClick={handleShufflePalette}
              className="flex items-center gap-1 font-mono text-[10.5px] text-brand-muted hover:text-brand-accent"
            >
              ⤨ Shuffle
            </button>
          </div>
          <div className="space-y-1.5 rounded-lg border border-brand-border bg-brand-surface-2 p-2">
            <div className="flex items-center gap-2 flex-wrap">
              {store.palette.map((col, idx) => (
                <div key={idx} className="relative group flex items-center">
                  <input
                    type="color"
                    value={col}
                    onChange={(e) => {
                      const next = [...store.palette];
                      next[idx] = e.target.value;
                      store.setPalette(next);
                    }}
                    className="h-8 w-8 rounded cursor-pointer border border-black/10 p-0"
                    title={`Edit Color ${idx + 1}`}
                  />
                  {store.palette.length > 2 && (
                    <button
                      type="button"
                      onClick={() => store.setPalette(store.palette.filter((_, i) => i !== idx))}
                      /* Touch-friendly remove button: visible unconditionally on mobile or sm:hidden group-hover:flex on desktop */
                      className="absolute -top-1.5 -right-1.5 flex sm:hidden sm:group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-brand-ink text-[10px] font-bold text-brand-bg shadow-xs focus:outline-none"
                      title="Remove color"
                      aria-label={`Remove color ${idx + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {store.palette.length < 6 && (
                <button
                  type="button"
                  onClick={() => store.setPalette([...store.palette, store.palette[store.palette.length - 1] ?? "#888888"])}
                  className="flex h-8 w-8 items-center justify-center rounded border border-dashed border-brand-border text-sm font-medium text-brand-muted hover:border-brand-accent hover:text-brand-accent"
                  title="Add color"
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mood Options */}
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-brand-muted">
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
                    ? "border-brand-ink bg-brand-ink text-brand-bg"
                    : "border-brand-border bg-brand-surface-2 text-brand-muted hover:border-[#8A8579]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Scale */}
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-brand-muted">
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
                    ? "border-brand-ink bg-brand-surface text-brand-ink"
                    : "border-brand-border bg-brand-surface-2 text-brand-muted hover:border-[#8A8579]"
                }`}
              >
                <b className="block text-xs">{scale}</b>
                <span className="font-mono text-[9px] text-brand-muted">
                  {scale === "1x" ? "100%" : scale === "2x" ? "200%" : scale === "3x" ? "300%" : "custom"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Device Summary & Mini Result Preview */}
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-brand-muted">
            Generated Result Preview & 4 Variations
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-surface p-3 mb-2">
            <MiniPreviewCanvas width={48} height={64} />
            <div className="flex-1 min-w-0">
              <b className="block text-xs font-medium text-brand-ink truncate">{activePreset.label}</b>
              <span className="font-mono text-[10.5px] text-brand-muted">
                {targetW} × {targetH} px
              </span>
              <span className="block font-mono text-[9.5px] text-brand-accent truncate mt-0.5">
                Seed: {store.seed}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {deriveFourVariations(store.seed, 0).map((vSeed, idx) => (
              <button
                key={vSeed}
                type="button"
                onClick={() => store.setSeed(vSeed)}
                className={`relative aspect-[3/4] overflow-hidden rounded border text-left transition ${
                  store.seed === vSeed ? "ring-2 ring-[#C9552F] border-brand-accent" : "border-brand-border hover:border-brand-ink"
                }`}
              >
                <div className="h-full w-full bg-brand-bg flex items-center justify-center font-mono text-[8px] text-brand-muted">
                  #{idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-ink py-3.5 text-sm font-medium text-brand-bg shadow-xs transition hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Generating preview…" : "Generate 4 Variations ✦"}
        </button>

        {/* Secondary Export Actions */}
        <button
          type="button"
          disabled={Boolean(exportStatus)}
          onClick={handleSaveRecipe}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-surface-2 py-3 text-xs font-medium text-brand-muted shadow-xs transition hover:bg-brand-bg disabled:opacity-50"
        >
          {exportStatus ?? "⛁ Export Single Wallpaper"}
        </button>

        {onOpenStudio && (
          <button
            type="button"
            onClick={onOpenStudio}
            className="w-full text-center text-xs font-medium text-brand-accent underline underline-offset-4"
          >
            Open in Studio Editor →
          </button>
        )}

        <p className="text-center font-sans text-[11px] text-brand-muted">
          All wallpapers are created for personal use only.
        </p>
      </div>
    </aside>
  );
}
