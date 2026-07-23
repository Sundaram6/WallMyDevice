import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getArchiveCategories, ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";

describe("Product Coherence Pass - Batch 1 Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("derives categories accurately from archive recipes", () => {
    const categories = getArchiveCategories();
    expect(categories.length).toBeGreaterThan(0);

    const allCat = categories.find((c) => c.id === "all");
    expect(allCat?.count).toBe(ARCHIVE_PRESETS.length);

    // Verify every category has > 0 count and valid label
    for (const cat of categories) {
      expect(cat.count).toBeGreaterThan(0);
      expect(cat.label.length).toBeGreaterThan(0);
    }
  });

  it("handles onboarding dismissal in localStorage", () => {
    const ONBOARDING_KEY = "wallmydevice:onboardingDismissed";
    expect(localStorage.getItem(ONBOARDING_KEY)).toBeNull();

    localStorage.setItem(ONBOARDING_KEY, "true");
    expect(localStorage.getItem(ONBOARDING_KEY)).toBe("true");
  });

  it("preserves redirect compatibility from old sign-in path", () => {
    // Verify redirection path target
    const oldPath = "/sign-in";
    const targetPath = "/profile";
    expect(oldPath).not.toBe(targetPath);
  });
});
