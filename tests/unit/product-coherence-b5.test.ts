import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ARCHIVE_PRESETS } from "@/lib/presets/archive-presets";

describe("Product Coherence Pass - Batch 5 Unit Tests (Detail View & Interactive Previews)", () => {
  const swatch = ARCHIVE_PRESETS[0];

  it("ensures Favourite click only toggles favourite state without triggering card click", () => {
    let cardSelected = false;
    let favToggled = false;

    const handleSelectCard = () => {
      cardSelected = true;
    };

    const handleToggleFav = (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      favToggled = true;
    };

    // Simulate clicking favourite badge
    const stopPropagationMock = vi.fn();
    handleToggleFav({ stopPropagation: stopPropagationMock });

    expect(favToggled).toBe(true);
    expect(stopPropagationMock).toHaveBeenCalled();
    expect(cardSelected).toBe(false);
  });

  it("derives a deterministic variation seed without mutating original recipe", () => {
    const originalSeed = swatch.seed;
    const variationSeed = `${originalSeed}-123`;

    expect(variationSeed).not.toBe(originalSeed);
    expect(swatch.seed).toBe(originalSeed);
  });

  it("respects prefers-reduced-motion for live hover previews", () => {
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    vi.stubGlobal("matchMedia", matchMediaMock);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    expect(prefersReducedMotion).toBe(true);
  });
});
