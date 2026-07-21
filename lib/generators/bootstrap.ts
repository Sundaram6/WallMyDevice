import { registerGenerator, getGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";

export function initializeBuiltInGenerators(): void {
  const builtIns: Array<{ id: string; [key: string]: unknown }> = [waveform, geometric, typography, fluidGradient];
  for (const g of builtIns) {
    const existing = getGenerator(g.id);
    if (!existing) {
      registerGenerator(g as Parameters<typeof registerGenerator>[0]);
    }
  }
}
