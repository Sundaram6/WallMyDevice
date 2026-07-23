"use client";

import React, { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArchiveTopbar } from "@/components/archive/ArchiveTopbar";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { decodeHash, type Recipe } from "@/lib/recipe/encode";
import { getGeneratorDisplayName, getResolutionStrategyLabel, getOrientationLabel } from "@/lib/recipe/metadata";
import { useEditorStore } from "@/store/useEditorStore";
import { addRecentlyViewed } from "@/lib/storage/library";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";

export default function SharePage({ params }: { params: Promise<{ ref: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tab, setTab] = useState<"archive" | "studio">("archive");
  const [searchQuery, setSearchQuery] = useState("");

  const ref = resolvedParams.ref;

  // Search curated presets by ID first
  const curated = ARCHIVE_PRESETS.find((p) => p.id === ref);

  let decodedRecipe: Recipe | null = null;
  let decodeError = false;

  if (!curated) {
    // Attempt decoding compact hash reference
    const decoded = decodeHash(`#r=${ref}`);
    if (decoded.ok) {
      decodedRecipe = decoded.recipe;
    } else {
      decodeError = true;
    }
  }

  // Record in recently viewed
  useEffect(() => {
    if (curated) {
      addRecentlyViewed(curated.id);
    }
  }, [curated]);

  const handleRemix = () => {
    const store = useEditorStore.getState();
    if (curated) {
      store.setGenerator(curated.generatorId);
      store.setPalette([...curated.palette]);
      store.setMode(curated.mode);
      store.setSeed(curated.seed);
      Object.entries(curated.params).forEach(([key, val]) => {
        store.updateParam(curated.generatorId, key, val);
      });
    } else if (decodedRecipe) {
      store.setGenerator(decodedRecipe.generator);
      store.setPalette([...decodedRecipe.palette]);
      store.setMode(decodedRecipe.mode);
      store.setSeed(decodedRecipe.seed);
      store.updateParam(decodedRecipe.generator, "params", decodedRecipe.params);
    }
    router.push("/?view=studio");
  };

  const title = curated?.name || (decodedRecipe ? `Custom ${decodedRecipe.generator}` : "Shared Recipe");
  const seed = curated?.seed || decodedRecipe?.seed || "seed";
  const generatorId = curated?.generatorId || decodedRecipe?.generator || "waveform";
  const palette = curated?.palette || decodedRecipe?.palette || ["#2B2A26", "#FAF8F4"];

  const preset = findPreset("iphone-15-pro") ?? DEVICE_PRESETS[0];

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#2B2A26] font-sans flex flex-col">
      <ArchiveTopbar
        currentTab={tab}
        onTabChange={(t) => {
          if (t === "studio") router.push("/?view=studio");
          else router.push("/");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={0}
      />

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        {decodeError ? (
          <div className="w-full max-w-md rounded-2xl border border-[#E4DFD3] bg-white p-8 text-center shadow-xs">
            <div className="text-3xl mb-3">⚠️</div>
            <h1 className="font-serif text-xl font-medium text-[#2B2A26]">Recipe Link Not Found</h1>
            <p className="mt-2 text-xs text-[#5B584F] leading-relaxed">
              This shared wallpaper link is invalid, corrupted or expired. Please verify the URL or explore our curated archive.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-[#2B2A26] px-5 py-3 text-xs font-medium text-white hover:bg-[#1a1917]"
            >
              Explore Archive →
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-xl rounded-2xl border border-[#E4DFD3] bg-white p-8 shadow-xs flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C9552F] mb-1">
              Shareable Recipe
            </span>
            <h1 className="font-serif text-2xl font-medium text-[#2B2A26] text-center mb-2">{title}</h1>
            <div className="flex gap-2 text-xs text-[#8A8579] font-mono mb-6">
              <span>{getGeneratorDisplayName(generatorId)}</span>
              <span>·</span>
              <span>Seed: {seed}</span>
            </div>

            {/* Palette Preview */}
            <div className="flex gap-2 mb-6">
              {palette.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} className="h-6 w-6 rounded-md border border-black/10 shadow-inner" title={c} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={handleRemix}
                className="flex-1 rounded-xl bg-[#2B2A26] py-3 text-xs font-medium text-white shadow-xs hover:bg-[#1a1917]"
              >
                ✦ Remix in Studio
              </button>
              <Link
                href="/"
                className="rounded-xl border border-[#D4CDBC] bg-[#FAF8F4] px-4 py-3 text-xs font-medium text-[#5B584F] hover:bg-[#F3EFE6]"
              >
                Archive
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
