"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "./SwatchThumbnail";
import { triggerSingleExport, triggerBatchExport } from "@/lib/export/actions";
import { getResolutionStrategyLabel, getOrientationLabel, getGeneratorDisplayName } from "@/lib/recipe/metadata";
import { addRecentlyViewed, addRecentlyGenerated } from "@/lib/storage/library";
import { deriveFourVariations, PACK_PRESETS } from "@/lib/export/variations";

type Props = {
  swatch: SwatchRecipe | null;
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onOpenStudio: () => void;
  onToggleFavorite: (id: string) => void;
};

export function WallpaperDetailModal({
  swatch,
  isOpen,
  isFavorite,
  onClose,
  onOpenStudio,
  onToggleFavorite,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const [activeSeed, setActiveSeed] = useState<string>("");
  const [setIndex, setSetIndex] = useState(0);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [packModalOpen, setPackModalOpen] = useState(false);

  const swatchId = swatch?.id;
  const swatchSeed = swatch?.seed;
  const prevOpenedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && swatchId && swatchSeed) {
      if (prevOpenedIdRef.current !== swatchId) {
        prevOpenedIdRef.current = swatchId;
        triggerRef.current = document.activeElement as HTMLElement;
        setActiveSeed(swatchSeed);
        setSetIndex(0);
        addRecentlyViewed(swatchId);
      }

      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      prevOpenedIdRef.current = null;
    }
  }, [isOpen, swatchId, swatchSeed, onClose]);

  if (!isOpen || !swatch) return null;

  const fourVariations = deriveFourVariations(swatch.seed, setIndex);
  const currentRecipe: SwatchRecipe = {
    ...swatch,
    seed: activeSeed,
  };

  const handleSelectVariation = (seed: string) => {
    setActiveSeed(seed);
    addRecentlyGenerated({
      name: `${swatch.name} (Variation)`,
      generatorId: swatch.generatorId,
      palette: [...swatch.palette],
      mode: swatch.mode,
      seed,
      params: { ...swatch.params },
    });
  };

  const handleExportCurrent = async () => {
    if (exportStatus) return;
    try {
      await triggerSingleExport({ width: 1179, height: 2556 }, (msg) => setExportStatus(msg));
    } catch {
    } finally {
      setTimeout(() => setExportStatus(null), 2500);
    }
  };

  const handleExportPack = async () => {
    if (exportStatus) return;
    try {
      await triggerBatchExport(
        ["desktop-1080p", "iphone-15-pro"],
        (msg) => setExportStatus(msg)
      );
      setPackModalOpen(false);
    } catch {
    } finally {
      setTimeout(() => setExportStatus(null), 2500);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/r/${swatch.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const resLabel = getResolutionStrategyLabel(swatch);
  const orientLabel = getOrientationLabel(swatch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 lg:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex h-[100dvh] sm:h-auto sm:max-h-[92vh] w-full max-w-4xl flex-col sm:flex-row overflow-hidden rounded-none sm:rounded-2xl border border-paper-300 bg-paper-50 text-ink-900 shadow-2 z-10"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail view"
          className="absolute top-4 right-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-paper-200/80 text-sm font-bold text-ink-500 hover:text-ink-900 shadow-1 border border-paper-300"
        >
          ✕
        </button>

        {/* Left / Top Large Preview Render */}
        <div className="relative flex-1 bg-paper-100 p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[480px]">
          <div className="relative aspect-[3/4] h-full max-h-[400px] w-auto overflow-hidden rounded-lg border border-paper-300 shadow-1 mb-4">
            <SwatchThumbnail swatch={currentRecipe} width={450} height={600} />
          </div>

          {/* 4 Deterministic Variations Row */}
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] uppercase text-ink-500">
              <span>4 Deterministic Variations (Set #{setIndex + 1})</span>
              <button
                type="button"
                onClick={() => setSetIndex((prev) => prev + 1)}
                className="text-accent-500 hover:underline"
              >
                + Another Set
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {fourVariations.map((vSeed, idx) => (
                <button
                  key={vSeed}
                  type="button"
                  onClick={() => handleSelectVariation(vSeed)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-md border text-left transition duration-[--dur-fast] ${
                    activeSeed === vSeed
                      ? "ring-2 ring-[var(--accent-500)] border-accent-500"
                      : "border-paper-300 hover:border-ink-900"
                  }`}
                >
                  <SwatchThumbnail swatch={{ ...swatch, seed: vSeed }} width={120} height={160} />
                  <span className="absolute bottom-1 left-1 bg-black/60 px-1 py-0.5 font-mono text-[8px] text-paper-0 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Details & Action Controls */}
        <div className="flex w-full sm:w-[380px] flex-col p-6 overflow-y-auto max-h-full space-y-5 bg-paper-50 border-t sm:border-t-0 sm:border-l border-paper-300">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent-500">
              {swatch.category} · {swatch.volume}
            </span>
            <h2 id="modal-title" className="font-serif text-2xl font-medium text-ink-900 mt-0.5">
              {swatch.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono text-ink-500">
              <span className="rounded bg-paper-100 px-2 py-0.5 border border-paper-300">
                {getGeneratorDisplayName(swatch.generatorId)}
              </span>
              <span className="rounded bg-paper-100 px-2 py-0.5 border border-paper-300">
                {resLabel} · {orientLabel}
              </span>
              <span className="rounded bg-paper-100 px-2 py-0.5 border border-paper-300">
                Seed: {activeSeed}
              </span>
            </div>
          </div>

          {/* Palette Colors */}
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-500 mb-1.5">
              Color Palette
            </label>
            <div className="flex gap-2">
              {swatch.palette.map((color, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: color }}
                  className="h-7 w-7 rounded-md border border-black/10 shadow-inner"
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Primary Action Controls */}
          <div className="space-y-2 pt-2 border-t border-paper-300">
            <button
              type="button"
              onClick={onOpenStudio}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-900 py-3 text-xs font-medium text-paper-0 shadow-1 hover:bg-accent-500 transition-colors duration-[--dur-fast]"
            >
              🛠 Remix Selected in Studio
            </button>

            <button
              type="button"
              onClick={() => setPackModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-paper-300 bg-paper-100 py-2.5 text-xs font-medium text-ink-900 shadow-1 hover:bg-paper-200 transition-colors duration-[--dur-fast]"
            >
              📦 Export for all my devices (Pack)
            </button>

            <button
              type="button"
              disabled={Boolean(exportStatus)}
              onClick={handleExportCurrent}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-paper-300 bg-paper-200 py-2.5 text-xs font-medium text-ink-500 shadow-1 hover:bg-paper-100 disabled:opacity-50 transition-colors duration-[--dur-fast]"
            >
              {exportStatus ?? "⛁ Export Single Wallpaper"}
            </button>
          </div>

          {/* Secondary Actions: Favorite & Copy Link */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleFavorite(swatch.id)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-paper-300 bg-paper-200 py-2.5 text-xs font-medium text-ink-500 hover:text-accent-500 transition-colors duration-[--dur-fast]"
            >
              <span>{isFavorite ? "♥" : "♡"}</span>
              <span>{isFavorite ? "Favourited" : "Favourite"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-paper-300 bg-paper-200 py-2.5 text-xs font-medium text-ink-500 hover:text-ink-900 transition-colors duration-[--dur-fast]"
            >
              <span>🔗</span>
              <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Device Pack Dialog */}
      {packModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-paper-300 bg-paper-50 p-6 shadow-2 space-y-4">
            <div className="flex items-center justify-between border-b border-paper-300 pb-3">
              <h3 className="font-serif text-lg font-medium text-ink-900">📦 Export Multi-Device Pack</h3>
              <button type="button" onClick={() => setPackModalOpen(false)} className="text-xs text-ink-500">✕</button>
            </div>
            <p className="text-xs text-ink-500">
              Generates a ZIP archive containing phone, tablet, laptop, and 4K desktop wallpapers for seed: <b className="font-mono">{activeSeed}</b> along with recipe manifest.json.
            </p>
            <div className="space-y-2">
              {PACK_PRESETS.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg border border-paper-300 bg-paper-200">
                  <div>
                    <b className="block text-ink-900">{p.label}</b>
                    <span className="font-mono text-[10px] text-ink-500">{p.width}×{p.height} px</span>
                    {p.cropWarning && <span className="block text-[9.5px] text-amber-600 mt-0.5">⚠️ {p.cropWarning}</span>}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Included</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleExportPack}
                className="flex-1 rounded-xl bg-ink-900 py-3 text-xs font-medium text-paper-0 shadow-1 hover:bg-accent-500 transition-colors duration-[--dur-fast]"
              >
                Download ZIP Package →
              </button>
              <button
                type="button"
                onClick={() => setPackModalOpen(false)}
                className="rounded-xl border border-paper-300 bg-paper-200 px-4 py-3 text-xs text-ink-500 transition-colors duration-[--dur-fast]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
