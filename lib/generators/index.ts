import { registerGenerator, _resetRegistryForTests as _resetBase } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  registerGenerator(fluidGradient);
  initialized = true;
}

export function _resetRegistryForTests(): void {
  _resetBase();
  initialized = false;
}

export { getGenerator, listGenerators } from "./registry";
export type { GeneratorId } from "./registry";
export type * from "./types";
