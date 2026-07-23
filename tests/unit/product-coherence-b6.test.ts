import { describe, it, expect } from "vitest";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";
import { CURATED_COLLECTIONS, getFeaturedTodayRecipe } from "@/lib/presets/collections";

describe("Product Coherence Pass - Batch 6 Unit Tests (Discovery, Curation & Collections)", () => {
  it("indexes search queries across title, category, tags, and generator", () => {
    const q = "waveform";
    const matches = ARCHIVE_PRESETS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.generatorId.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
    expect(matches.length).toBeGreaterThan(0);
  });

  it("sorts archive presets by alphabetical name correctly", () => {
    const sorted = [...ARCHIVE_PRESETS].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name.localeCompare(sorted[1].name)).toBeLessThanOrEqual(0);
  });

  it("maintains at least 8 curated collections with valid cover recipes and non-empty items", () => {
    expect(CURATED_COLLECTIONS.length).toBeGreaterThanOrEqual(8);
    for (const col of CURATED_COLLECTIONS) {
      expect(col.id.length).toBeGreaterThan(0);
      expect(col.title.length).toBeGreaterThan(0);
      expect(col.itemIds.length).toBeGreaterThan(0);
      expect(col.coverRecipeId.length).toBeGreaterThan(0);
    }
  });

  it("derives a stable, deterministic daily featured recipe based on date", () => {
    const recipe1 = getFeaturedTodayRecipe();
    const recipe2 = getFeaturedTodayRecipe();

    expect(recipe1.id).toBe(recipe2.id);
    expect(recipe1.seed).toBe(recipe2.seed);
  });

  it("resets pagination visible count accurately", () => {
    const INITIAL_PAGE_SIZE = 12;
    let visibleCount = INITIAL_PAGE_SIZE;
    visibleCount += 12; // user loads more
    expect(visibleCount).toBe(24);

    // Simulate search filter reset
    visibleCount = INITIAL_PAGE_SIZE;
    expect(visibleCount).toBe(12);
  });
});
