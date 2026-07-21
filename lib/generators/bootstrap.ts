import { registerGenerator, _resetRegistryForTests as _resetBase } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";

let didBootstrap = false;

export function initializeBuiltInGenerators(): void {
  if (didBootstrap) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  registerGenerator(fluidGradient);
  didBootstrap = true;
}

export function _resetBootstrapForTests(): void {
  _resetBase();
  didBootstrap = false;
}
