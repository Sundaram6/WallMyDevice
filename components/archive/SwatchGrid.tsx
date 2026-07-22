import React, { useState, useMemo } from "react";
import { SwatchCard } from "./SwatchCard";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { useEditorStore } from "@/store/useEditorStore";

type Props = {
  activeCategory: string;
  searchQuery: string;
  onOpenStudio?: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
};

export function SwatchGrid({
  activeCategory,
  searchQuery,
  onOpenStudio: _onOpenStudio,
  favorites,
  onToggleFavorite,
}: Props) {
  const store = useEditorStore();
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>("terracotta-bloom");
  const [sortOption, setSortOption] = useState<"newest" | "name">("newest");

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

  const handleSelectSwatch = (swatch: SwatchRecipe) => {
    setSelectedSwatchId(swatch.id);

    // Apply recipe to editor store
    store.setGenerator(swatch.generatorId);
    store.setPalette(swatch.palette);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);
    store.updateParam(swatch.generatorId, Object.keys(swatch.params)[0], Object.values(swatch.params)[0]);
  };

  return (
    <section className="flex-1 p-8 lg:p-11">
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-xs text-[#5B584F]">
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
          <span className="cursor-pointer opacity-80">田</span>
          <span className="cursor-pointer opacity-80">☰</span>
        </div>
      </div>

      {/* Grid of swatch cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredSwatches.map((swatch) => (
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
      <div className="mt-12 text-center">
        <button
          type="button"
          className="rounded-lg border border-[#D4CDBC] bg-white px-7 py-3 text-xs text-[#5B584F] shadow-xs transition hover:bg-[#F3EFE6] hover:text-[#2B2A26]"
        >
          Load more prints ⌄
        </button>
      </div>
    </section>
  );
}
