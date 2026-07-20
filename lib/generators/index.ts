import { registerGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
