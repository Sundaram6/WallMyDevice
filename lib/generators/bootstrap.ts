import { registerGenerator, getGenerator, _resetRegistryForTests as _resetBase } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";
import type { GeneratorId } from "./registry";
import type { Generator } from "./types";

export function initializeBuiltInGenerators(): void {
  const builtIns: Generator<any>[] = [waveform, geometric, typography, fluidGradient];
  for (const g of builtIns) {
    const existing = getGenerator(g.id);
    if (!existing) {
      registerGenerator(g);
    }
  }
}

export function _resetBootstrapForTests(): void {
  _resetBase();
}
