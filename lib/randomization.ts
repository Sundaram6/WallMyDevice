import { listGenerators, getDefaultParams } from "./generators/registry";
import { hashSeed } from "./prng";
import { ARCHIVE_PRESETS } from "./presets/archive-presets";
import { CURATED_PALETTES } from "./palettes/data";
import { getPaletteByLuminance } from "./palettes/contrast";

export interface WallpaperCombo {
  generatorId: string;
  seed: string;
  palette: string[];
  params: Record<string, unknown>;
}

export function getRandomSeed(): string {
  return hashSeed(String(Math.random() * 1e9));
}

/**
 * Returns a high-aesthetic, curated palette with verified contrast.
 */
export function getRandomPalette(generatorId?: string): string[] {
  let candidates: string[][] = [];

  // If generatorId specified, prefer palettes from matching archive presets
  if (generatorId) {
    const matchingPresets = ARCHIVE_PRESETS.filter((p) => p.generatorId === generatorId);
    if (matchingPresets.length > 0) {
      candidates = matchingPresets.map((p) => p.palette);
    }
  }

  if (candidates.length === 0) {
    candidates = [
      ...ARCHIVE_PRESETS.map((p) => p.palette),
      ...CURATED_PALETTES.map((p) => p.colors),
    ];
  }

  // Filter candidates to ensure palette has >= 2 colors and contrast between lightest and darkest
  const goodCandidates = candidates.filter((p) => {
    if (!p || p.length < 2) return false;
    const { lightestLuminance, darkestLuminance } = getPaletteByLuminance(p);
    return lightestLuminance - darkestLuminance >= 0.15;
  });

  const pool = goodCandidates.length > 0 ? goodCandidates : candidates;
  const chosen = pool[Math.floor(Math.random() * pool.length)] || ["#0f172a", "#38bdf8", "#f59e0b"];
  return [...chosen];
}

export function getRandomGeneratorId(): string {
  const allGenerators = listGenerators();
  if (allGenerators.length === 0) return "waveform";
  return allGenerators[Math.floor(Math.random() * allGenerators.length)].id;
}

export function getRandomCombo(currentGenId?: string): WallpaperCombo {
  const allGenerators = listGenerators();
  let nextGenId = getRandomGeneratorId();

  if (currentGenId && allGenerators.length > 1) {
    const candidates = allGenerators.filter((g) => g.id !== currentGenId);
    if (candidates.length > 0) {
      nextGenId = candidates[Math.floor(Math.random() * candidates.length)].id;
    }
  }

  // Check if there is an archive preset for this generator to use balanced default parameters
  const matchingPresets = ARCHIVE_PRESETS.filter((p) => p.generatorId === nextGenId);
  const basePreset = matchingPresets.length > 0 ? matchingPresets[Math.floor(Math.random() * matchingPresets.length)] : null;

  return {
    generatorId: nextGenId,
    seed: getRandomSeed(),
    palette: getRandomPalette(nextGenId),
    params: basePreset?.params ? { ...getDefaultParams(nextGenId), ...basePreset.params } : getDefaultParams(nextGenId),
  };
}

export function getRemixCombo(currentGenId: string): WallpaperCombo {
  const matchingPresets = ARCHIVE_PRESETS.filter((p) => p.generatorId === currentGenId);
  const basePreset = matchingPresets.length > 0 ? matchingPresets[Math.floor(Math.random() * matchingPresets.length)] : null;

  return {
    generatorId: currentGenId,
    seed: getRandomSeed(),
    palette: getRandomPalette(currentGenId),
    params: basePreset?.params ? { ...getDefaultParams(currentGenId), ...basePreset.params } : getDefaultParams(currentGenId),
  };
}

export function applyComboToStore(combo: WallpaperCombo): void {
  if (typeof window === "undefined") return;
  const store = (window as any).useEditorStore?.getState?.() || (window as any).__WMD_STORE__?.getState?.();
  if (!store) return;

  store.setGenerator(combo.generatorId);
  store.setSeed(combo.seed);
  store.setPalette([...combo.palette]);
  if (combo.params) {
    Object.entries(combo.params).forEach(([key, val]) => {
      store.updateParam(combo.generatorId, key, val);
    });
  }
}
