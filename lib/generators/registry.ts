import type { Generator } from "./types";

const registry = new Map<string, { original: Generator<any>, cloned: Readonly<Generator<any>> }>();

export function registerGenerator(g: Generator<any>): void {
  const existing = registry.get(g.id);
  if (existing) {
    if (existing.original === g) return;
    throw new Error(`Generator "${g.id}" already registered`);
  }

  // Deeply clone and freeze to prevent accidental mutation of the canonical defaults
  const cloned = {
    ...g,
    schema: {
      ...g.schema,
      defaults: structuredClone(g.schema.defaults)
    }
  };

  Object.freeze(cloned.schema.defaults);
  Object.freeze(cloned.schema);
  Object.freeze(cloned);

  registry.set(g.id, { original: g, cloned });
}

export function getGenerator(id: string): Readonly<Generator<any>> | undefined {
  return registry.get(id)?.cloned;
}

export function listGenerators(): Readonly<Generator<any>>[] {
  return Array.from(registry.values()).map(v => v.cloned);
}

export function _resetRegistryForTests(): void {
  registry.clear();
}

export type GeneratorId = string;
