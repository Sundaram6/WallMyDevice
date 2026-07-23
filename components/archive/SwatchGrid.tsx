import React, { useState, useMemo, useEffect } from "react";
import { SwatchCard } from "./SwatchCard";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { useEditorStore } from "@/store/useEditorStore";
import Link from "next/link";

type Props = {
  activeCategory: string;
  searchQuery: string;
  onOpenStudio?: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
};

const INITIAL_PAGE_SIZE = 12;
const PAGE_INCREMENT = 12;
const ONBOARDING_DISMISSED_KEY = "wallmydevice:onboardingDismissed";

export function SwatchGrid({
  activeCategory,
  searchQuery,
  onOpenStudio,
  favorites,
  onToggleFavorite,
}: Props) {
  const store = useEditorStore();
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>("terracotta-bloom");
  const [sortOption, setSortOption] = useState<"newest" | "name">("newest");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check onboarding dismissal on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY);
      if (!dismissed) {
        setShowOnboarding(true);
      }
    } catch {}
  }, []);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    try {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true");
    } catch {}
  };

  // Filter swatches based on Category & Search Query
  const filteredSwatches = useMemo(() => {
    return ARCHIVE_PRESETS.filter((swatch) => {
      // Category Filter
      if (activeCategory === "new" && !swatch.isNew) return false;
      if (activeCategory === "trending" && !swatch.isTrending) return false;
      if (
        activeCategory !== "all" &&
        activeCategory !== "new" &&
        activeCategory !== "trending" &&
        swatch.categoryTag !== activeCategory
      ) {
        return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = swatch.name.toLowerCase().includes(q);
        const matchesCat = swatch.category.toLowerCase().includes(q);
        const matchesGen = swatch.generatorId.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesGen) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return 0; // Default order
    });
  }, [activeCategory, searchQuery, sortOption]);

  // Reset pagination whenever filters or search query change
  useEffect(() => {
    setVisibleCount(INITIAL_PAGE_SIZE);
  }, [activeCategory, searchQuery, sortOption]);

  const visibleSwatches = useMemo(() => {
    return filteredSwatches.slice(0, visibleCount);
  }, [filteredSwatches, visibleCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_INCREMENT);
      setIsLoadingMore(false);
    }, 150);
  };

  const handleSelectSwatch = (swatch: SwatchRecipe) => {
    setSelectedSwatchId(swatch.id);

    // Apply complete recipe to editor store
    store.setGenerator(swatch.generatorId);
    store.setPalette([...swatch.palette]);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);

    // Apply ALL parameters for the generator recipe
    Object.entries(swatch.params).forEach(([key, val]) => {
      store.updateParam(swatch.generatorId, key, val);
    });
  };

  const hasMore = visibleCount < filteredSwatches.length;

  return (
    <section className="flex-1 p-4 sm:p-6 lg:p-11 pb-28 sm:pb-16">
      {/* First-time Onboarding Banner */}
      {showOnboarding && (
        <div className="mb-6 rounded-2xl border border-[#E4DFD3] bg-[#F3EFE6] p-5 shadow-xs relative">
          <button
            type="button"
            onClick={handleDismissOnboarding}
            aria-label="Dismiss introduction"
            className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs text-[#5B584F] hover:text-[#2B2A26] border border-[#D4CDBC]"
          >
            ✕
          </button>
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#C9552F]">
              Procedural Laboratory
            </span>
            <h2 className="mt-1 font-serif text-lg font-medium text-[#2B2A26]">
              Every wallpaper is generated in code.
            </h2>
            <p className="mt-1.5 text-xs text-[#5B584F] leading-relaxed">
              WallMyDevice renders geometric patterns, fluid gradients, and wave curves on your device canvas. Every print is powered by a unique seed — edit palettes, scale dimensions, or remix any artwork in real time. Rendering and exports happen 100% locally.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenStudio) onOpenStudio();
                }}
                className="rounded-xl bg-[#2B2A26] px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-[#1a1917] transition"
              >
                Create a Wallpaper ✦
              </button>
              <Link
                href="/about"
                className="rounded-xl border border-[#D4CDBC] bg-white px-4 py-2 text-xs font-medium text-[#5B584F] hover:text-[#2B2A26] hover:bg-[#FAF8F4] transition"
              >
                How It Works →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div className="text-xs text-[#5B584F]">
          Showing <b className="font-medium text-[#2B2A26]">{visibleSwatches.length}</b> of{" "}
          <b className="font-medium text-[#2B2A26]">{filteredSwatches.length}</b> prints
        </div>
        <div className="flex items-center gap-4 text-xs text-[#5B584F]">
          <label className="flex items-center gap-1">
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-transparent font-medium text-[#2B2A26] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      {/* Grid of swatch cards: 2 columns on normal mobile (>=340px / grid-cols-2), 1 col on <340px (min-[340px]:grid-cols-2) */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
        {visibleSwatches.map((swatch) => (
          <SwatchCard
            key={swatch.id}
            swatch={swatch}
            isSelected={selectedSwatchId === swatch.id}
            isFavorite={favorites.has(swatch.id)}
            onSelect={handleSelectSwatch}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {filteredSwatches.length === 0 && (
        <div className="py-20 text-center text-sm text-[#8A8579]">
          No prints found matching your filters.
        </div>
      )}

      {/* Load more prints CTA */}
      {hasMore && (
        <div className="mt-8 sm:mt-12 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#D4CDBC] bg-white px-7 py-3 text-xs font-medium text-[#5B584F] shadow-xs transition hover:bg-[#F3EFE6] hover:text-[#2B2A26] disabled:opacity-50"
          >
            {isLoadingMore ? "Loading prints..." : "Load more prints ⌄"}
          </button>
        </div>
      )}
    </section>
  );
}
