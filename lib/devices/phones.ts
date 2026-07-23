export type PhoneDisplay = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export type PhoneBrandId =
  | "apple"
  | "samsung"
  | "google"
  | "oneplus"
  | "xiaomi"
  | "motorola"
  | "nothing"
  | "oppo"
  | "vivo"
  | "honor"
  | "sony"
  | "asus";

export type PhoneModel = {
  id: string;
  brandId: PhoneBrandId;
  name: string;
  releaseYear: number;
  status: "current" | "previous";
  featured?: boolean;
  frame: "iphone" | "android";
  displays: PhoneDisplay[];
  sources: Array<{ name: string; url: string }>;
  verifiedAt: string;
};

export const PHONE_BRANDS: Array<{ id: PhoneBrandId; label: string }> = [
  { id: "apple", label: "Apple" },
  { id: "samsung", label: "Samsung" },
  { id: "google", label: "Google" },
  { id: "oneplus", label: "OnePlus" },
  { id: "xiaomi", label: "Xiaomi" },
  { id: "motorola", label: "Motorola" },
  { id: "nothing", label: "Nothing" },
  { id: "oppo", label: "Oppo" },
  { id: "vivo", label: "Vivo" },
  { id: "honor", label: "Honor" },
  { id: "sony", label: "Sony" },
  { id: "asus", label: "Asus" },
];

export const PHONE_MODELS: PhoneModel[] = [
  // Apple
  {
    id: "iphone-15-pro",
    brandId: "apple",
    name: "iPhone 15 Pro",
    releaseYear: 2023,
    status: "current",
    featured: true,
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1179, height: 2556 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-15",
    brandId: "apple",
    name: "iPhone 15",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1170, height: 2532 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-16-pro-max",
    brandId: "apple",
    name: "iPhone 16 Pro Max",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1320, height: 2868 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone/" }],
    verifiedAt: "2026-07-23",
  },
  // Samsung
  {
    id: "samsung-s24-ultra",
    brandId: "samsung",
    name: "Galaxy S24 Ultra",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3120 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-galaxy-z-fold5",
    brandId: "samsung",
    name: "Galaxy Z Fold5",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1812, height: 2176 },
      { id: "cover", name: "Cover Display", width: 904, height: 2316 },
    ],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-23",
  },
  // Google
  {
    id: "pixel-8-pro",
    brandId: "google",
    name: "Pixel 8 Pro",
    releaseYear: 2023,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1344, height: 2992 }],
    sources: [{ name: "Google Store", url: "https://store.google.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-9-pro",
    brandId: "google",
    name: "Pixel 9 Pro",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1280, height: 2856 }],
    sources: [{ name: "Google Store", url: "https://store.google.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "google-pixel-fold",
    brandId: "google",
    name: "Pixel Fold",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1840, height: 2100 },
      { id: "cover", name: "Cover Display", width: 1080, height: 2096 },
    ],
    sources: [{ name: "Google Store", url: "https://store.google.com" }],
    verifiedAt: "2026-07-23",
  },
  // OnePlus
  {
    id: "oneplus-12",
    brandId: "oneplus",
    name: "OnePlus 12",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oneplus-open",
    brandId: "oneplus",
    name: "OnePlus Open",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 2240, height: 2440 },
      { id: "cover", name: "Cover Display", width: 1116, height: 2484 },
    ],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },
  // Xiaomi
  {
    id: "xiaomi-14-ultra",
    brandId: "xiaomi",
    name: "Xiaomi 14 Ultra",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Xiaomi Specs", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  // Motorola
  {
    id: "motorola-edge-50-pro",
    brandId: "motorola",
    name: "Motorola Edge 50 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Motorola Store", url: "https://www.motorola.com" }],
    verifiedAt: "2026-07-23",
  },
  // Nothing
  {
    id: "nothing-phone-2",
    brandId: "nothing",
    name: "Nothing Phone (2)",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Nothing Tech", url: "https://nothing.tech" }],
    verifiedAt: "2026-07-23",
  },
  // Oppo
  {
    id: "oppo-find-x7-ultra",
    brandId: "oppo",
    name: "Oppo Find X7 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "Oppo Specs", url: "https://www.oppo.com" }],
    verifiedAt: "2026-07-23",
  },
  // Vivo
  {
    id: "vivo-x100-pro",
    brandId: "vivo",
    name: "Vivo X100 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1260, height: 2800 }],
    sources: [{ name: "Vivo Specs", url: "https://www.vivo.com" }],
    verifiedAt: "2026-07-23",
  },
  // Honor
  {
    id: "honor-magic-6-pro",
    brandId: "honor",
    name: "Honor Magic6 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1280, height: 2800 }],
    sources: [{ name: "Honor Specs", url: "https://www.hihonor.com" }],
    verifiedAt: "2026-07-23",
  },
  // Sony
  {
    id: "sony-xperia-1-vi",
    brandId: "sony",
    name: "Sony Xperia 1 VI",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Sony Specs", url: "https://www.sony.com" }],
    verifiedAt: "2026-07-23",
  },
  // Asus
  {
    id: "asus-rog-phone-8-pro",
    brandId: "asus",
    name: "Asus ROG Phone 8 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Asus Specs", url: "https://www.asus.com" }],
    verifiedAt: "2026-07-23",
  },
];

export interface DeviceCatalogueFeed {
  lastUpdated: string;
  source: string;
  models: PhoneModel[];
}

export class DeviceCatalogueProvider {
  private feed: DeviceCatalogueFeed;

  constructor(initialFeed?: Partial<DeviceCatalogueFeed>) {
    this.feed = {
      lastUpdated: initialFeed?.lastUpdated ?? "2026-07-23T20:00:00Z",
      source: initialFeed?.source ?? "wallmydevice-bundled-v2",
      models: this.validateAndDeduplicate(initialFeed?.models ?? PHONE_MODELS),
    };
  }

  private validateAndDeduplicate(models: PhoneModel[]): PhoneModel[] {
    const valid: PhoneModel[] = [];
    const seen = new Set<string>();

    for (const m of models) {
      if (!m.id || !m.name || !m.brandId || !m.displays?.length) continue;
      if (m.displays.some(d => d.width < 320 || d.height < 320 || d.width > 15360 || d.height > 15360)) continue;
      if (!seen.has(m.id)) {
        seen.add(m.id);
        valid.push(m);
      }
    }
    return valid.length > 0 ? valid : PHONE_MODELS;
  }

  public getFeed(): DeviceCatalogueFeed {
    return this.feed;
  }

  public getModels(): PhoneModel[] {
    return this.feed.models;
  }

  public syncExternalFeed(feed: Partial<DeviceCatalogueFeed>): boolean {
    if (!feed.models || feed.models.length === 0) return false;
    const validated = this.validateAndDeduplicate(feed.models);
    if (validated.length === 0) return false;
    this.feed = {
      lastUpdated: feed.lastUpdated ?? new Date().toISOString(),
      source: feed.source ?? "external-sync",
      models: validated,
    };
    return true;
  }
}

export const defaultCatalogueProvider = new DeviceCatalogueProvider();

export function getModelsByBrand(brandId: string): PhoneModel[] {
  return defaultCatalogueProvider.getModels().filter(m => m.brandId === (brandId as any));
}

export function findModel(id: string): PhoneModel | undefined {
  return defaultCatalogueProvider.getModels().find(m => m.id === id);
}

export function findDisplay(modelId: string, displayId: string): PhoneDisplay | undefined {
  const model = findModel(modelId);
  return model?.displays.find(d => d.id === displayId);
}
