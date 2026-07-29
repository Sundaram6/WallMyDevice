import { registerGenerator, getGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";
import { meshGradient } from "./mesh-gradient";
import { auroraFlow } from "./aurora-flow";
import { duotoneBurst } from "./duotone-burst";
import { flowField } from "./flow-field";
import { grainTexture } from "./grain-texture";
import { marbleFluid } from "./marble-fluid";
import { voronoiMosaic } from "./voronoi-mosaic";
import { lowpolyTerrain } from "./lowpoly-terrain";
import { halftoneDots } from "./halftone-dots";
import { bauhausBlocks } from "./bauhaus-blocks";
import { topographicLines } from "./topographic-lines";
import { metaballs } from "./metaballs";
import { waveInterference } from "./wave-interference";
import { starfieldNebula } from "./starfield-nebula";

export function initializeBuiltInGenerators(): void {
  const builtIns: Array<{ id: string; [key: string]: unknown }> = [
    waveform,
    geometric,
    typography,
    fluidGradient,
    meshGradient,
    auroraFlow,
    duotoneBurst,
    flowField,
    grainTexture,
    marbleFluid,
    voronoiMosaic,
    lowpolyTerrain,
    halftoneDots,
    bauhausBlocks,
    topographicLines,
    metaballs,
    waveInterference,
    starfieldNebula,
  ];

  for (const g of builtIns) {
    const existing = getGenerator(g.id);
    if (!existing) {
      registerGenerator(g as Parameters<typeof registerGenerator>[0]);
    }
  }
}
