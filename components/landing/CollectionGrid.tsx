"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import { WallpaperDetailModal } from "@/components/archive/WallpaperDetailModal";
import { useEditorStore } from "@/store/useEditorStore";
import { initLibrary, toggleFavourite, subscribeLibrary } from "@/lib/storage/library";

type Props = {
  onSelectRecipe?: (recipe: SwatchRecipe) => void;
};

export function CollectionGrid({ onSelectRecipe }: Props) {
  const [activeModalSwatch, setActiveModalSwatch] = useState<SwatchRecipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const store = useEditorStore();

  useEffect(() => {
    const data = initLibrary();
    setFavorites(data.favourites);

    const unsubscribe = subscribeLibrary((updated) => {
      setFavorites(updated.favourites);
    });
    return unsubscribe;
  }, []);

  const categories = ["All", "Fluid", "Cyberpunk", "Cinematic", "Brutalism", "Seasonal", "Minimal"];

  const filteredPresets = selectedCategory === "All"
    ? ARCHIVE_PRESETS.slice(0, 18)
    : ARCHIVE_PRESETS.filter((p) =>
        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()))
      ).slice(0, 18);

  const handleSelectSwatch = (swatch: SwatchRecipe) => {
    store.setGenerator(swatch.generatorId);
    store.setPalette([...swatch.palette]);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);
    Object.entries(swatch.params).forEach(([key, val]) => {
      store.updateParam(swatch.generatorId, key, val);
    });

    if (onSelectRecipe) {
      onSelectRecipe(swatch);
    } else {
      setActiveModalSwatch(swatch);
    }
  };

  const handleToggleFav = (e: React.MouseEvent, swatchId: string) => {
    e.stopPropagation();
    toggleFavourite(swatchId);
  };

  return (
    <section className="w-full bg-paper-50 py-20 px-4 sm:px-8 lg:px-12 border-t border-paper-300">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-paper-300 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-500">
                CURATED PRINT ARCHIVE
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink-900 mt-1.5">
              A rotating catalogue of hand-crafted seeds.
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-500 uppercase tracking-wider bg-paper-100 px-3.5 py-1.5 rounded-xl border border-paper-300">
            <span>SHOWING {filteredPresets.length} OF {ARCHIVE_PRESETS.length}</span>
            <span>·</span>
            <span className="text-accent-500 font-semibold">VOL. 08</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-all duration-[--dur-fast] ${
                selectedCategory === cat
                  ? "bg-ink-900 text-paper-0 shadow-1 font-semibold"
                  : "bg-paper-100 text-ink-700 hover:text-ink-900 hover:bg-paper-200 border border-paper-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Wallpapers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPresets.map((swatch) => {
            const isFav = favorites.includes(swatch.id);

            return (
              <article
                key={swatch.id}
                onClick={() => handleSelectSwatch(swatch)}
                className="group cursor-pointer rounded-3xl border border-paper-300 bg-paper-100 p-4 transition-all duration-[--dur-fast] hover:border-accent-500/60 shadow-1 hover:shadow-2 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-inner">
                  <SwatchThumbnail swatch={swatch} width={340} height={450} />
                  
                  {/* Floating Heart Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFav(e, swatch.id)}
                    aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
                    className={`absolute top-3 left-3 rounded-full p-2 backdrop-blur-md border transition-all duration-[--dur-fast] shadow-md ${
                      isFav
                        ? "bg-accent-500 text-white border-accent-500 scale-110"
                        : "bg-black/40 text-white/70 border-white/10 hover:text-white hover:bg-black/60"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>

                  {/* Floating Glassmorphism Remix Badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all duration-[--dur-fast] transform group-hover:scale-105 shadow-md flex items-center gap-1">
                    <span>Remix</span>
                    <span className="text-accent-500">✦</span>
                  </div>

                  {/* Seed Badge (Left Bottom) */}
                  <div className="absolute bottom-3 left-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-0.5 font-mono text-[9px] text-white/90 opacity-80">
                    #{swatch.seed}
                  </div>

                  {swatch.isNew && (
                    <div className="absolute bottom-3 right-3 rounded-full bg-accent-500 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-white shadow-md">
                      NEW
                    </div>
                  )}
                </div>

                {/* Card Meta */}
                <div className="mt-4 flex items-start justify-between gap-2 px-1">
                  <div>
                    <h3 className="font-serif text-base font-medium text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast]">
                      {swatch.name}
                    </h3>
                    <p className="font-mono text-[10.5px] text-ink-500 mt-0.5 flex items-center gap-1.5">
                      <span>{swatch.category}</span>
                      <span>·</span>
                      <span className="text-ink-900/70 font-medium">{swatch.volume}</span>
                    </p>
                  </div>

                  {/* Palette Chips (Rounded Rectangles) */}
                  <div className="flex gap-1 pt-1 bg-paper-50 p-1 rounded-lg border border-paper-300 shadow-inner">
                    {swatch.palette.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        style={{ backgroundColor: color }}
                        className="h-3.5 w-3.5 rounded-md border border-black/10"
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-xs font-medium text-paper-0 shadow-1 hover:bg-accent-500 transition-all duration-[--dur-fast] transform hover:-translate-y-0.5"
          >
            <span>Explore All {ARCHIVE_PRESETS.length} Prints in Archive</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Wallpaper Detail Modal */}
      {activeModalSwatch && (
        <WallpaperDetailModal
          swatch={activeModalSwatch}
          isOpen={!!activeModalSwatch}
          isFavorite={favorites.includes(activeModalSwatch.id)}
          onClose={() => setActiveModalSwatch(null)}
          onOpenStudio={() => {
            setActiveModalSwatch(null);
            const el = document.getElementById("studio-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onToggleFavorite={() => toggleFavourite(activeModalSwatch.id)}
        />
      )}
    </section>
  );
}
