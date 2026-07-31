import { describe, it, expect } from "vitest";
import { deviceEngine } from "./DeviceEngine";
import { DEVICE_METADATA_CATALOG, findCatalogDevice } from "../devices/metadataCatalog";

describe("Phase 2 — Device Engine (Metadata Driven System)", () => {
  it("should populate catalog with complete device specifications", () => {
    expect(DEVICE_METADATA_CATALOG.length).toBeGreaterThan(5);

    const iphone = findCatalogDevice("apple-iphone-17-pro-max");
    expect(iphone).toBeDefined();
    expect(iphone?.brand).toBe("Apple");
    expect(iphone?.cutout.type).toBe("dynamic-island");
    expect(iphone?.cornerRadiusPx).toBe(55);
    expect(iphone?.safeArea.topPercent).toBe(12);

    const s25Ultra = findCatalogDevice("samsung-galaxy-s25-ultra");
    expect(s25Ultra).toBeDefined();
    expect(s25Ultra?.brand).toBe("Samsung");
    expect(s25Ultra?.cutout.type).toBe("punch-hole");
    expect(s25Ultra?.cornerRadiusPx).toBe(18);
  });

  it("should resolve device metadata dynamically by id", () => {
    const dev = deviceEngine.getDevice("apple-iphone-17-pro-max");
    expect(dev).toBeDefined();
    expect(dev?.widthPx).toBe(1320);
    expect(dev?.heightPx).toBe(2868);
  });

  it("should calculate effective dimensions based on orientation", () => {
    const dev = deviceEngine.getDevice("apple-iphone-17-pro-max")!;
    const portrait = deviceEngine.calculateEffectiveDimensions(dev, "portrait");
    expect(portrait.width).toBe(1320);
    expect(portrait.height).toBe(2868);

    const landscape = deviceEngine.calculateEffectiveDimensions(dev, "landscape");
    expect(landscape.width).toBe(2868);
    expect(landscape.height).toBe(1320);
  });

  it("should filter devices by brand or category cleanly", () => {
    const appleDevices = deviceEngine.listDevices(undefined, "Apple");
    expect(appleDevices.length).toBeGreaterThan(0);
    expect(appleDevices.every((d) => d.brand === "Apple")).toBe(true);

    const phones = deviceEngine.listDevices("phone");
    expect(phones.length).toBeGreaterThan(0);
    expect(phones.every((d) => d.category === "phone")).toBe(true);
  });
});
