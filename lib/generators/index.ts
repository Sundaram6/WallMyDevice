import { initializeBuiltInGenerators } from "./bootstrap";

export const ensureRegistered = initializeBuiltInGenerators;

export { getGenerator, listGenerators } from "./registry";
export type { GeneratorId } from "./registry";
export type * from "./types";
