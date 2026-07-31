/**
 * Device Catalog Service — Extensible device specification service.
 * Supports importing, searching, and validating device metadata from external data sources
 * (JSON schemas) without tight coupling to any single website.
 */

import type { CompleteDeviceMetadata } from "./metadataCatalog";
import { DEVICE_METADATA_CATALOG } from "./metadataCatalog";

export class DeviceCatalogService {
  private static instance: DeviceCatalogService;
  private catalog: Map<string, CompleteDeviceMetadata> = new Map();

  private constructor() {
    this.importCatalog(DEVICE_METADATA_CATALOG);
  }

  public static getInstance(): DeviceCatalogService {
    if (!DeviceCatalogService.instance) {
      DeviceCatalogService.instance = new DeviceCatalogService();
    }
    return DeviceCatalogService.instance;
  }

  /**
   * Imports external device metadata records into the catalog.
   */
  public importCatalog(records: CompleteDeviceMetadata[]): void {
    records.forEach((record) => {
      if (this.validateRecord(record)) {
        this.catalog.set(record.id, record);
      }
    });
  }

  /**
   * Schema validation for external device JSON records.
   */
  public validateRecord(record: Partial<CompleteDeviceMetadata>): record is CompleteDeviceMetadata {
    return Boolean(
      record &&
        typeof record.id === "string" &&
        typeof record.brand === "string" &&
        typeof record.model === "string" &&
        typeof record.screenWidthPx === "number" &&
        typeof record.screenHeightPx === "number" &&
        record.safeArea &&
        record.cutout
    );
  }

  public getDeviceById(id: string): CompleteDeviceMetadata | undefined {
    return this.catalog.get(id);
  }

  public searchDevices(query: string): CompleteDeviceMetadata[] {
    const q = query.toLowerCase().trim();
    if (!q) return Array.from(this.catalog.values());

    return Array.from(this.catalog.values()).filter(
      (d) =>
        d.brand.toLowerCase().includes(q) ||
        d.model.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.resolutionLabel.toLowerCase().includes(q)
    );
  }

  public getDevicesByBrand(brand: string): CompleteDeviceMetadata[] {
    const b = brand.toLowerCase();
    return Array.from(this.catalog.values()).filter((d) => d.brand.toLowerCase() === b);
  }

  public getDevicesByCategory(category: CompleteDeviceMetadata["category"]): CompleteDeviceMetadata[] {
    return Array.from(this.catalog.values()).filter((d) => d.category === category);
  }

  public getAllBrands(): string[] {
    const brands = new Set(Array.from(this.catalog.values()).map((d) => d.brand));
    return Array.from(brands).sort();
  }

  public getAllCategories(): string[] {
    const categories = new Set(Array.from(this.catalog.values()).map((d) => d.category));
    return Array.from(categories).sort();
  }

  public exportCatalogJson(): string {
    return JSON.stringify(Array.from(this.catalog.values()), null, 2);
  }
}

export const deviceCatalogService = DeviceCatalogService.getInstance();
