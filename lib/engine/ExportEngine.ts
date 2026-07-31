/**
 * ExportEngine — High-DPI export pipeline manager.
 * Orchestrates multi-format wallpaper generation (PNG, JPG, WebP, SVG),
 * file naming, and browser download triggers.
 */

export type ExportFormat = "png" | "jpg" | "webp" | "svg";

export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  quality?: number; // 0.1 to 1.0 for jpg/webp
  width: number;
  height: number;
}

export class ExportEngine {
  private static instance: ExportEngine;

  private constructor() {}

  public static getInstance(): ExportEngine {
    if (!ExportEngine.instance) {
      ExportEngine.instance = new ExportEngine();
    }
    return ExportEngine.instance;
  }

  public getMimeType(format: ExportFormat): string {
    switch (format) {
      case "jpg":
        return "image/jpeg";
      case "webp":
        return "image/webp";
      case "svg":
        return "image/svg+xml";
      case "png":
      default:
        return "image/png";
    }
  }

  public triggerDownload(blob: Blob, filename: string): void {
    if (typeof document === "undefined") return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  public generateFilename(generatorId: string, width: number, height: number, format: ExportFormat): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    return `wallmydevice_${generatorId}_${width}x${height}_${timestamp}.${format}`;
  }
}

export const exportEngine = ExportEngine.getInstance();
