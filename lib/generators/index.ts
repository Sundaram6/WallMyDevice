import { initializeBuiltInGenerators, _resetBootstrapForTests } from "./bootstrap";

export const ensureRegistered = initializeBuiltInGenerators;
export const _resetRegistryForTests = _resetBootstrapForTests;



export { getGenerator, listGenerators } from "./registry";
export type { GeneratorId } from "./registry";
export type * from "./types";
