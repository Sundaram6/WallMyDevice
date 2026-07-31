/**
 * ConfigurationEngine — Manages global configuration, schema defaults,
 * generator parameter control schemas, and local storage user preferences.
 */

export interface AppConfig {
  defaultGeneratorId: string;
  defaultSeed: string;
  defaultPalette: string[];
  defaultExportFormat: "png" | "jpg" | "webp" | "svg";
  storagePrefix: string;
  maxHistorySteps: number;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  defaultGeneratorId: "waveform",
  defaultSeed: "k3p9x2a7",
  defaultPalette: ["#0f172a", "#f59e0b"],
  defaultExportFormat: "png",
  storagePrefix: "wallmydevice:",
  maxHistorySteps: 50,
};

export class ConfigurationEngine {
  private static instance: ConfigurationEngine;
  private config: AppConfig;

  private constructor(config: AppConfig = DEFAULT_APP_CONFIG) {
    this.config = { ...config };
  }

  public static getInstance(config?: AppConfig): ConfigurationEngine {
    if (!ConfigurationEngine.instance) {
      ConfigurationEngine.instance = new ConfigurationEngine(config);
    }
    return ConfigurationEngine.instance;
  }

  public getConfig(): Readonly<AppConfig> {
    return this.config;
  }

  public getStorageKey(key: string): string {
    return `${this.config.storagePrefix}${key}`;
  }

  public loadPreference<T>(key: string, fallback: T): T {
    if (typeof localStorage === "undefined") return fallback;
    try {
      const item = localStorage.getItem(this.getStorageKey(key));
      return item ? (JSON.parse(item) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  public savePreference<T>(key: string, value: T): void {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
    } catch (e) {
      console.warn("Failed to save preference to localStorage:", e);
    }
  }
}

export const configurationEngine = ConfigurationEngine.getInstance();
