import type { Generator } from "./types";

type Registry = Record<string, Generator<any>>;

export const _registry: Registry = {};

export function registerGenerator(g: Generator<any>): void {
  if (_registry[g.id]) throw new Error(`Generator "${g.id}" already registered`);
  _registry[g.id] = g;
}

export function getGenerator(id: string): Generator<any> | undefined {
  return _registry[id];
}

export function listGenerators(): Generator<any>[] {
  return Object.values(_registry);
}

export function _resetRegistryForTests(): void {
  for (const k of Object.keys(_registry)) delete _registry[k];
}

export type GeneratorId = string;
