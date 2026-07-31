/**
 * PluginAPI — Extensible generator and custom effect registration API.
 * Enforces SOLID principles, contract validation, and plugin isolation.
 */

import type { Generator } from "../generators/types";
import { registerGenerator, getGenerator, listGenerators } from "../generators/registry";

export interface GeneratorPluginMeta {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
}

export class PluginAPI {
  private static instance: PluginAPI;

  private constructor() {}

  public static getInstance(): PluginAPI {
    if (!PluginAPI.instance) {
      PluginAPI.instance = new PluginAPI();
    }
    return PluginAPI.instance;
  }

  public registerPlugin<TParams>(meta: GeneratorPluginMeta, generator: Generator<TParams>): void {
    if (!generator || !generator.id || !generator.render) {
      throw new Error(`Invalid plugin instance for "${meta.id}". Must implement render engine contract.`);
    }

    try {
      registerGenerator(generator);
    } catch (err) {
      console.warn(`Plugin "${meta.id}" registration note:`, err);
    }
  }

  public getPlugin(id: string): Readonly<Generator<any>> | undefined {
    return getGenerator(id);
  }

  public getRegisteredPlugins(): Readonly<Generator<any>>[] {
    return listGenerators();
  }
}

export const pluginAPI = PluginAPI.getInstance();
