/**
 * DeviceEngine — Fully metadata-driven device resolution system.
 * Computes aspect ratio, screen/physical dimensions, corner radii,
 * cutouts (Dynamic Island / Notch / Punch hole), and safe area boundaries.
 */

export type DeviceCategory = "phone" | "tablet" | "laptop" | "desktop" | "tv" | "wearable" | "foldable" | "custom";
export type Orientation = "portrait" | "landscape";

export interface CutoutSpec {
  type: "dynamic-island" | "notch" | "punch-hole" | "none";
  widthPx: number;
  heightPx: number;
  topOffsetPx: number;
}

export interface SafeAreaSpec {
  topPercent: number;
  bottomPercent: number;
  leftPercent: number;
  rightPercent: number;
}

export interface DeviceMetadata {
  id: string;
  brand: string;
  model: string;
  category: DeviceCategory;
  widthPx: number;
  heightPx: number;
  aspectRatio: number; // width / height
  physicalWidthMm?: number;
  physicalHeightMm?: number;
  pixelDensityPpi?: number;
  refreshRateHz?: number;
  frameThicknessPx: number;
  cornerRadiusPx: number;
  bezelWidthPx: number;
  cutout: CutoutSpec;
  safeArea: SafeAreaSpec;
  supportedOrientations: Orientation[];
  features: string[];
}

export const GENERIC_DESKTOP: DeviceMetadata = {
  id: "generic-desktop-1080p",
  brand: "Generic",
  model: "Desktop Monitor 1080p",
  category: "desktop",
  widthPx: 1920,
  heightPx: 1080,
  aspectRatio: 1920 / 1080,
  frameThicknessPx: 16,
  cornerRadiusPx: 12,
  bezelWidthPx: 12,
  cutout: { type: "none", widthPx: 0, heightPx: 0, topOffsetPx: 0 },
  safeArea: { topPercent: 0, bottomPercent: 0, leftPercent: 0, rightPercent: 0 },
  supportedOrientations: ["landscape"],
  features: ["hdr", "high-refresh"],
};

export const GENERIC_IPHONE: DeviceMetadata = {
  id: "apple-iphone-16-pro",
  brand: "Apple",
  model: "iPhone 16 Pro Max",
  category: "phone",
  widthPx: 1320,
  heightPx: 2868,
  aspectRatio: 1320 / 2868,
  frameThicknessPx: 12,
  cornerRadiusPx: 55,
  bezelWidthPx: 8,
  cutout: { type: "dynamic-island", widthPx: 120, heightPx: 35, topOffsetPx: 12 },
  safeArea: { topPercent: 12, bottomPercent: 8, leftPercent: 0, rightPercent: 0 },
  supportedOrientations: ["portrait"],
  features: ["pro-motion", "super-retina", "action-button"],
};

import { DEVICE_METADATA_CATALOG } from "../devices/metadataCatalog";

export class DeviceEngine {
  private static instance: DeviceEngine;
  private catalog: Map<string, DeviceMetadata> = new Map();

  private constructor() {
    this.registerDevice(GENERIC_DESKTOP);
    this.registerDevice(GENERIC_IPHONE);
    DEVICE_METADATA_CATALOG.forEach((item) => {
      this.registerDevice({
        id: item.id,
        brand: item.brand,
        model: item.model,
        category: item.category,
        widthPx: item.screenWidthPx,
        heightPx: item.screenHeightPx,
        aspectRatio: item.aspectRatio,
        physicalWidthMm: item.physicalWidthMm,
        physicalHeightMm: item.physicalHeightMm,
        pixelDensityPpi: item.pixelDensityPpi,
        refreshRateHz: item.refreshRateHz,
        frameThicknessPx: item.frameThicknessPx,
        cornerRadiusPx: item.cornerRadiusPx,
        bezelWidthPx: item.bezelWidthPx,
        cutout: item.cutout,
        safeArea: item.safeArea,
        supportedOrientations: [item.orientation],
        features: item.supportedFeatures,
      });
    });
  }

  public static getInstance(): DeviceEngine {
    if (!DeviceEngine.instance) {
      DeviceEngine.instance = new DeviceEngine();
    }
    return DeviceEngine.instance;
  }

  public registerDevice(device: DeviceMetadata): void {
    this.catalog.set(device.id, device);
  }

  public getDevice(id: string): DeviceMetadata | undefined {
    return this.catalog.get(id);
  }

  public listDevices(category?: DeviceCategory, brand?: string): DeviceMetadata[] {
    const list = Array.from(this.catalog.values());
    return list.filter((d) => {
      if (category && d.category !== category) return false;
      if (brand && d.brand.toLowerCase() !== brand.toLowerCase()) return false;
      return true;
    });
  }

  public calculateEffectiveDimensions(
    device: DeviceMetadata,
    orientation: Orientation
  ): { width: number; height: number; aspect: number } {
    const isLandscape = orientation === "landscape";
    const w = isLandscape ? Math.max(device.widthPx, device.heightPx) : Math.min(device.widthPx, device.heightPx);
    const h = isLandscape ? Math.min(device.widthPx, device.heightPx) : Math.max(device.widthPx, device.heightPx);
    return { width: w, height: h, aspect: w / h };
  }

  /**
   * Calculates the true single-source-of-truth logical layout dimensions based strictly
   * on physical real-world measurements, ensuring zero distortion and 1:1 cross-device proportionality.
   */
  public getLogicalDeviceMetrics(
    device: DeviceMetadata,
    orientation: Orientation
  ) {
    // 5.5 maps physical mm directly to standardized CSS logical pixels 
    // (e.g., iPhone 16 Pro: 71.5mm * 5.5 = 393.25px logical width, matching iOS specs perfectly)
    const MM_TO_PX = 5.5;

    const baseW = device.physicalWidthMm ? device.physicalWidthMm * MM_TO_PX : device.widthPx / 3;
    const baseH = device.physicalHeightMm ? device.physicalHeightMm * MM_TO_PX : device.heightPx / 3;

    const isLandscape = orientation === "landscape";
    const layoutWidthPx = isLandscape ? Math.max(baseW, baseH) : Math.min(baseW, baseH);
    const layoutHeightPx = isLandscape ? Math.min(baseW, baseH) : Math.max(baseW, baseH);
    
    // Fixed CSS values defined in catalog (these are already authored in CSS space)
    const frameThicknessLayout = device.frameThicknessPx;
    const cornerRadiusLayout = device.cornerRadiusPx;
    const bezelWidthLayout = device.bezelWidthPx;

    return {
      layoutWidthPx,
      layoutHeightPx,
      frameThicknessLayout,
      cornerRadiusLayout,
      bezelWidthLayout,
      aspect: layoutWidthPx / layoutHeightPx,
      cutout: device.cutout,
    };
  }
}

export const deviceEngine = DeviceEngine.getInstance();
