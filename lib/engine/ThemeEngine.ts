/**
 * ThemeEngine — Manages application theme mode, system color scheme synchronization,
 * and design system CSS token application.
 */

export type ThemeMode = "light" | "dark" | "auto";
export type SystemColorScheme = "light" | "dark";

export class ThemeEngine {
  private static instance: ThemeEngine;
  private currentMode: ThemeMode = "light";
  private systemScheme: SystemColorScheme = "light";
  private listeners: Set<(mode: ThemeMode, effectiveScheme: SystemColorScheme) => void> = new Set();

  private constructor() {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      this.systemScheme = media.matches ? "dark" : "light";
    }
  }

  public static getInstance(): ThemeEngine {
    if (!ThemeEngine.instance) {
      ThemeEngine.instance = new ThemeEngine();
    }
    return ThemeEngine.instance;
  }

  public getMode(): ThemeMode {
    return this.currentMode;
  }

  public getEffectiveScheme(): SystemColorScheme {
    return this.currentMode === "auto" ? this.systemScheme : this.currentMode;
  }

  public setMode(mode: ThemeMode): void {
    this.currentMode = mode;
    this.applyTheme();
  }

  public setSystemScheme(scheme: SystemColorScheme): void {
    this.systemScheme = scheme;
    if (this.currentMode === "auto") {
      this.applyTheme();
    }
  }

  public subscribe(listener: (mode: ThemeMode, effectiveScheme: SystemColorScheme) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public applyTheme(): void {
    if (typeof document === "undefined") return;
    const effective = this.getEffectiveScheme();
    document.documentElement.setAttribute("data-theme", effective);
    this.listeners.forEach((listener) => listener(this.currentMode, effective));
  }
}

export const themeEngine = ThemeEngine.getInstance();
