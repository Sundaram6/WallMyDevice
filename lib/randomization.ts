import { listGenerators, getDefaultParams } from "./generators/registry";
import { hashSeed } from "./prng";
import { ARCHIVE_PRESETS } from "./presets/archive-presets";

export interface WallpaperCombo {
  generatorId: string;
  seed: string;
  palette: string[];
  params: Record<string, unknown>;
}

export function getRandomSeed(): string {
  return hashSeed(String(Math.random() * 1e9));
}

export function getRandomPalette(): string[] {
  const randomPreset = ARCHIVE_PRESETS[Math.floor(Math.random() * ARCHIVE_PRESETS.length)];
  return randomPreset ? [...randomPreset.palette] : ["#1F3A5F", "#8A9A6E", "#D9541F", "#FAF7F0"];
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

  return {
    generatorId: nextGenId,
    seed: getRandomSeed(),
    palette: getRandomPalette(),
    params: getDefaultParams(nextGenId),
  };
}

export function getRemixCombo(currentGenId: string): WallpaperCombo {
  return {
    generatorId: currentGenId,
    seed: getRandomSeed(),
    palette: getRandomPalette(),
    params: getDefaultParams(currentGenId),
  };
}
