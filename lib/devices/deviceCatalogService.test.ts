import { describe, it, expect } from "vitest";
import { deviceCatalogService } from "./deviceCatalogService";

describe("Phase 5 — Device Library Expansion & Catalog Service", () => {
  it("should list brands covering major global and regional manufacturers", () => {
    const brands = deviceCatalogService.getAllBrands();
    expect(brands.length).toBeGreaterThan(15);
    expect(brands).toContain("Apple");
    expect(brands).toContain("Samsung");
    expect(brands).toContain("Google");
    expect(brands).toContain("Xiaomi");
    expect(brands).toContain("Vivo");
    expect(brands).toContain("iQOO");
    expect(brands).toContain("OPPO");
    expect(brands).toContain("Realme");
  });

  it("should search devices across models, brands, and categories", () => {
    const vivoResults = deviceCatalogService.searchDevices("vivo");
    expect(vivoResults.length).toBeGreaterThan(0);
    expect(vivoResults[0].brand).toBe("Vivo");

    const foldResults = deviceCatalogService.searchDevices("foldable");
    expect(foldResults.length).toBeGreaterThan(0);
  });

  it("should import external JSON device schema records safely", () => {
    const newRecord = {
      id: "custom-test-device-2026",
      brand: "TestBrand",
      model: "Super Phone 1",
      category: "phone" as const,
      physicalWidthMm: 70,
      physicalHeightMm: 150,
      screenWidthPx: 1080,
      screenHeightPx: 2400,
      aspectRatio: 1080 / 2400,
      resolutionLabel: "1080 x 2400 px",
      safeArea: { topPercent: 10, bottomPercent: 7, leftPercent: 0, rightPercent: 0 },
      cornerRadiusPx: 40,
      cutout: { type: "punch-hole" as const, widthPx: 20, heightPx: 20, topOffsetPx: 12 },
      frameThicknessPx: 10,
      bezelWidthPx: 6,
      bezelStyle: "thin-border" as const,
      refreshRateHz: 120,
      pixelDensityPpi: 400,
      orientation: "portrait" as const,
      supportedFeatures: ["test"],
    };

    deviceCatalogService.importCatalog([newRecord]);
    const fetched = deviceCatalogService.getDeviceById("custom-test-device-2026");
    expect(fetched).toBeDefined();
    expect(fetched?.model).toBe("Super Phone 1");
  });

  it("should export full catalog JSON dynamically", () => {
    const json = deviceCatalogService.exportCatalogJson();
    expect(json).toContain("iPhone 17 Pro Max");
    expect(json).toContain("Galaxy S25 Ultra");
  });
});
