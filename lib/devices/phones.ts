export type PhoneDisplay = {
  id: string;
  name: string;
  width: number; // native pixels, portrait orientation (shorter edge first)
  height: number; // native pixels, portrait orientation (longer edge)
};

export type PhoneModel = {
  id: string;
  brandId: "apple" | "samsung" | "google";
  name: string;
  releaseYear: number;
  status: "current" | "previous";
  featured?: boolean;
  frame: "iphone" | "android";
  displays: PhoneDisplay[];
  sources: Array<{ name: string; url: string }>;
  verifiedAt: string; // ISO date
};

// NOTE: This catalogue is static and version controlled. Sources are included per-model.
// The list intentionally focuses on a small set of flagship and foldable models plus
// legacy models historically referenced by WallMyDevice presets.

export const PHONE_MODELS: PhoneModel[] = [
  {
    id: "iphone-15-pro",
    brandId: "apple",
    name: "iPhone 15 Pro",
    releaseYear: 2023,
    status: "current",
    featured: true,
    frame: "iphone",
    displays: [
      { id: "main", name: "Main Display", width: 1179, height: 2556 },
    ],
    sources: [
      { name: "Apple - iPhone 15 Pro Tech Specs", url: "https://www.apple.com/iphone-15-pro/specs/" },
      { name: "GSMArena - iPhone 15 Pro", url: "https://www.gsmarena.com/apple_iphone_15_pro-12597.php" },
    ],
    verifiedAt: "2026-07-22",
  },
  {
    id: "iphone-15",
    brandId: "apple",
    name: "iPhone 15",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [
      { id: "main", name: "Main Display", width: 1170, height: 2532 },
    ],
    sources: [
      { name: "Apple - iPhone 15 Tech Specs", url: "https://www.apple.com/iphone-15/specs/" },
      { name: "GSMArena - iPhone 15", url: "https://www.gsmarena.com/apple_iphone_15-12596.php" },
    ],
    verifiedAt: "2026-07-22",
  },
  {
    id: "pixel-8-pro",
    brandId: "google",
    name: "Pixel 8 Pro",
    releaseYear: 2023,
    status: "current",
    featured: true,
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1344, height: 2992 },
    ],
    sources: [
      { name: "Google - Pixel 8 Pro specs", url: "https://store.google.com/product/pixel_8_pro" },
      { name: "GSMArena - Pixel 8 Pro", url: "https://www.gsmarena.com/google_pixel_8_pro-11405.php" },
    ],
    verifiedAt: "2026-07-22",
  },
  {
    id: "samsung-s24-ultra",
    brandId: "samsung",
    name: "Samsung Galaxy S24 Ultra",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1440, height: 3120 },
    ],
    sources: [
      { name: "Samsung - Galaxy S24 Ultra specs", url: "https://www.samsung.com/mobile/galaxy-s24-ultra/specs/" },
      { name: "GSMArena - Galaxy S24 Ultra", url: "https://www.gsmarena.com/samsung_galaxy_s24_ultra-12223.php" },
    ],
    verifiedAt: "2026-07-22",
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
    sources: [
      { name: "Samsung - Galaxy Z Fold5 specs", url: "https://www.samsung.com/galaxy-z-fold5/specs/" },
      { name: "GSMArena - Galaxy Z Fold5", url: "https://www.gsmarena.com/samsung_galaxy_z_fold5-11997.php" },
    ],
    verifiedAt: "2026-07-22",
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
    sources: [
      { name: "Google - Pixel Fold specs", url: "https://store.google.com/pixel_fold/specs" },
      { name: "GSMArena - Pixel Fold", url: "https://www.gsmarena.com/google_pixel_fold-11812.php" },
    ],
    verifiedAt: "2026-07-22",
  },
  // Legacy/compatibility models referenced by existing presets
  {
    id: "macbook-14",
    brandId: "apple",
    name: "MacBook Pro 14-inch (legacy preset)",
    releaseYear: 2021,
    status: "previous",
    frame: "iphone",
    displays: [
      { id: "main", name: "Main Display", width: 3024, height: 1964 },
    ],
    sources: [
      { name: "Apple - MacBook Pro 14 specs", url: "https://www.apple.com/macbook-pro-14-and-16/specs/" }],
    verifiedAt: "2026-07-22",
  },
];

export const PHONE_BRANDS = [
  { id: "apple", label: "Apple" },
  { id: "samsung", label: "Samsung" },
  { id: "google", label: "Google" },
];

export function getModelsByBrand(brandId: string) {
  return PHONE_MODELS.filter(m => m.brandId === (brandId as any));
}

export function findModel(id: string) {
  return PHONE_MODELS.find(m => m.id === id);
}

export function findDisplay(modelId: string, displayId: string) {
  const model = findModel(modelId);
  return model?.displays.find(d => d.id === displayId);
}
