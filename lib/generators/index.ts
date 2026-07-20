import { registerGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
