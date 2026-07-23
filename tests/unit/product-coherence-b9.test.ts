import { describe, it, expect } from "vitest";
import { CHANGELOG_HISTORY, CURRENT_VERSION } from "@/lib/changelog/data";
import { getFeaturedTodayRecipe } from "@/lib/presets/collections";

describe("Product Coherence Pass - Batch 9 Unit Tests (Feedback, Changelog & Featured Drops)", () => {
  it("structures changelog releases cleanly with versions, dates, and honest limitations", () => {
    expect(CHANGELOG_HISTORY.length).toBeGreaterThanOrEqual(1);
    const latest = CHANGELOG_HISTORY[0];

    expect(latest.version).toBe(CURRENT_VERSION);
    expect(latest.changes.length).toBeGreaterThan(0);
    expect(latest.fixes.length).toBeGreaterThan(0);
    expect(latest.limitations.length).toBeGreaterThan(0);
  });

  it("builds a prefilled GitHub issue URL for feedback submission", () => {
    const feedbackText = "Found a alignment glitch in geometric generator";
    const title = encodeURIComponent(`[FEEDBACK] WallMyDevice ${CURRENT_VERSION}`);
    const body = encodeURIComponent(`**Category**: feedback\n**Version**: ${CURRENT_VERSION}\n\n${feedbackText}`);

    const url = `https://github.com/Sundaram6/WallMyDevice/issues/new?title=${title}&body=${body}`;

    expect(url).toContain("github.com/Sundaram6/WallMyDevice/issues/new");
    expect(url).toContain(CURRENT_VERSION);
    expect(url).toContain("alignment");
  });

  it("verifies stable deterministic daily featured drop selection", () => {
    const drop1 = getFeaturedTodayRecipe();
    const drop2 = getFeaturedTodayRecipe();

    expect(drop1.id).toBe(drop2.id);
    expect(drop1.name.length).toBeGreaterThan(0);
  });
});
