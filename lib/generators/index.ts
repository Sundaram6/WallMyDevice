import { registerGenerator, getGenerator } from "./registry";
import { waveform } from "./waveform";

export function ensureRegistered(): void {
  if (getGenerator("waveform")) return;
  registerGenerator(waveform);
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
