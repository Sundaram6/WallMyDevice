import type { Generator } from "./types";

const registry = new Map<string, { original: Generator<any>, cloned: Readonly<Generator<any>> }>();

function cloneData<T>(data: T): T {
  return typeof structuredClone === "function" ? structuredClone(data) : JSON.parse(JSON.stringify(data));
}

function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value !== null && (typeof value === "object" || typeof value === "function") && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}

export function registerGenerator(g: Generator<any>): void {
  const existing = registry.get(g.id);
  if (existing) {
    if (existing.original === g) return;
    throw new Error(`Generator "${g.id}" already registered`);
  }

  // Safely construct the cloned definition
  const cloned = {
    ...g,
    schema: {
      ...g.schema,
      defaults: deepFreeze(cloneData(g.schema.defaults)),
    },
    paramControls: deepFreeze(cloneData(g.paramControls)),
  };

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
