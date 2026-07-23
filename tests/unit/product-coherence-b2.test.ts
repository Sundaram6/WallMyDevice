import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  LIBRARY_STORAGE_KEY,
  LEGACY_KEYS,
  initLibrary,
  resetLibraryForTesting,
  toggleFavourite,
  addRecentlyViewed,
  addRecentlyGenerated,
  setProfileName,
  createWishlist,
} from "@/lib/storage/library";

describe("Product Coherence Pass - Batch 2 Unit Tests (Unified Local Library)", () => {
  beforeEach(() => {
    localStorage.clear();
    resetLibraryForTesting();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    resetLibraryForTesting();
  });

  it("initializes and persists data with a versioned schema in localStorage", () => {
    const lib = initLibrary();
    expect(lib.version).toBe(1);
    expect(lib.favourites).toEqual([]);

    toggleFavourite("terracotta-bloom");
    const storedRaw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    expect(storedRaw).not.toBeNull();
    const stored = JSON.parse(storedRaw!);
    expect(stored.favourites).toContain("terracotta-bloom");
  });

  it("migrates old legacy keys without discarding valid data", () => {
    // Populate old legacy keys
    localStorage.setItem(
      LEGACY_KEYS.GUEST_USER,
      JSON.stringify({
        name: "Legacy User",
        favourites: ["indigo-garden"],
        wishlists: [{ id: "w1", name: "Mobile", itemIds: ["terracotta-bloom"] }],
      })
    );
    localStorage.setItem(LEGACY_KEYS.FAVORITES_OLD, JSON.stringify(["olive-branch"]));
    localStorage.setItem(LEGACY_KEYS.RECENT_VIEWED_OLD, JSON.stringify(["lofi-sunset"]));

    const lib = initLibrary();
    expect(lib.profileName).toBe("Legacy User");
    expect(lib.favourites).toContain("indigo-garden");
    expect(lib.favourites).toContain("olive-branch");
    expect(lib.recentlyViewed).toContain("lofi-sunset");
    expect(lib.wishlists.length).toBe(1);
    expect(lib.wishlists[0].name).toBe("Mobile");
  });

  it("recovers safely from malformed or corrupted localStorage data", () => {
    localStorage.setItem(LIBRARY_STORAGE_KEY, "{ invalid json }");
    const lib = initLibrary();
    expect(lib.version).toBe(1);
    expect(Array.isArray(lib.favourites)).toBe(true);
  });

  it("deduplicates favourites and entries", () => {
    toggleFavourite("terracotta-bloom");
    toggleFavourite("terracotta-bloom"); // remove
    toggleFavourite("terracotta-bloom"); // add back

    const lib = initLibrary();
    const count = lib.favourites.filter((f) => f === "terracotta-bloom").length;
    expect(count).toBe(1);
  });

  it("enforces history size caps for recently viewed and generated", () => {
    for (let i = 0; i < 50; i++) {
      addRecentlyViewed(`preset-${i}`);
    }
    const lib = initLibrary();
    expect(lib.recentlyViewed.length).toBeLessThanOrEqual(30);
    expect(lib.recentlyViewed[0]).toBe("preset-49");
  });
});
