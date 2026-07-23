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
  | "redmi"
  | "poco"
  | "motorola"
  | "nothing"
  | "oppo"
  | "vivo"
  | "iqoo"
  | "honor"
  | "sony"
  | "asus"
  | "realme";

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
  { id: "redmi", label: "Redmi" },
  { id: "poco", label: "Poco" },
  { id: "motorola", label: "Motorola" },
  { id: "nothing", label: "Nothing" },
  { id: "oppo", label: "Oppo" },
  { id: "vivo", label: "Vivo" },
  { id: "iqoo", label: "iQOO" },
  { id: "honor", label: "Honor" },
  { id: "sony", label: "Sony" },
  { id: "asus", label: "Asus" },
  { id: "realme", label: "Realme" },
];

export const PHONE_MODELS: PhoneModel[] = [
  // ─── Apple ────────────────────────────────────────────────────────────────
  {
    id: "iphone-16-pro-max",
    brandId: "apple",
    name: "iPhone 16 Pro Max",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1320, height: 2868 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-16-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-16-pro",
    brandId: "apple",
    name: "iPhone 16 Pro",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1206, height: 2622 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-16-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-16-plus",
    brandId: "apple",
    name: "iPhone 16 Plus",
    releaseYear: 2024,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1290, height: 2796 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-16/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-16",
    brandId: "apple",
    name: "iPhone 16",
    releaseYear: 2024,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1179, height: 2556 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-16/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-15-pro-max",
    brandId: "apple",
    name: "iPhone 15 Pro Max",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1290, height: 2796 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-15-pro",
    brandId: "apple",
    name: "iPhone 15 Pro",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1179, height: 2556 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-15-plus",
    brandId: "apple",
    name: "iPhone 15 Plus",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1290, height: 2796 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-15",
    brandId: "apple",
    name: "iPhone 15",
    releaseYear: 2023,
    status: "current",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1179, height: 2556 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-15/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-14-pro-max",
    brandId: "apple",
    name: "iPhone 14 Pro Max",
    releaseYear: 2022,
    status: "previous",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 1290, height: 2796 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-14-pro/specs/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iphone-se-3",
    brandId: "apple",
    name: "iPhone SE (3rd gen)",
    releaseYear: 2022,
    status: "previous",
    frame: "iphone",
    displays: [{ id: "main", name: "Main Display", width: 750, height: 1334 }],
    sources: [{ name: "Apple Tech Specs", url: "https://www.apple.com/iphone-se/specs/" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Samsung ───────────────────────────────────────────────────────────────
  {
    id: "samsung-s25-ultra",
    brandId: "samsung",
    name: "Galaxy S25 Ultra",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3120 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s25-ultra/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-s25-plus",
    brandId: "samsung",
    name: "Galaxy S25+",
    releaseYear: 2025,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3120 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s25/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-s25",
    brandId: "samsung",
    name: "Galaxy S25",
    releaseYear: 2025,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s25/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-galaxy-z-fold6",
    brandId: "samsung",
    name: "Galaxy Z Fold6",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1856, height: 2160 },
      { id: "cover", name: "Cover Display", width: 968, height: 2376 },
    ],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-z-fold6/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-galaxy-z-flip6",
    brandId: "samsung",
    name: "Galaxy Z Flip6",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1080, height: 2640 },
      { id: "cover", name: "Cover Display", width: 720, height: 748 },
    ],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-z-flip6/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-s24-ultra",
    brandId: "samsung",
    name: "Galaxy S24 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3088 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s24-ultra/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-s24-plus",
    brandId: "samsung",
    name: "Galaxy S24+",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3088 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s24/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-s24",
    brandId: "samsung",
    name: "Galaxy S24",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com/global/galaxy/galaxy-s24/" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-galaxy-z-fold5",
    brandId: "samsung",
    name: "Galaxy Z Fold5",
    releaseYear: 2023,
    status: "previous",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1812, height: 2176 },
      { id: "cover", name: "Cover Display", width: 904, height: 2316 },
    ],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "samsung-a55",
    brandId: "samsung",
    name: "Galaxy A55",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Google ────────────────────────────────────────────────────────────────
  {
    id: "pixel-9-pro-xl",
    brandId: "google",
    name: "Pixel 9 Pro XL",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1344, height: 2992 }],
    sources: [{ name: "Google Store", url: "https://store.google.com/product/pixel_9_pro" }],
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
    sources: [{ name: "Google Store", url: "https://store.google.com/product/pixel_9_pro" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-9",
    brandId: "google",
    name: "Pixel 9",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2424 }],
    sources: [{ name: "Google Store", url: "https://store.google.com/product/pixel_9" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-9-pro-fold",
    brandId: "google",
    name: "Pixel 9 Pro Fold",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Inner Display", width: 2076, height: 2152 },
      { id: "cover", name: "Cover Display", width: 1080, height: 2424 },
    ],
    sources: [{ name: "Google Store", url: "https://store.google.com/product/pixel_9_pro_fold" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-8-pro",
    brandId: "google",
    name: "Pixel 8 Pro",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1344, height: 2992 }],
    sources: [{ name: "Google Store", url: "https://store.google.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-8",
    brandId: "google",
    name: "Pixel 8",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Google Store", url: "https://store.google.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "pixel-8a",
    brandId: "google",
    name: "Pixel 8a",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Google Store", url: "https://store.google.com/product/pixel_8a" }],
    verifiedAt: "2026-07-23",
  },

  // ─── OnePlus ───────────────────────────────────────────────────────────────
  {
    id: "oneplus-13",
    brandId: "oneplus",
    name: "OnePlus 13",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com/global/oneplus-13" }],
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
      { id: "main", name: "Inner Display", width: 2268, height: 2440 },
      { id: "cover", name: "Cover Display", width: 1116, height: 2484 },
    ],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oneplus-12",
    brandId: "oneplus",
    name: "OnePlus 12",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oneplus-12r",
    brandId: "oneplus",
    name: "OnePlus 12R",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oneplus-nord-4",
    brandId: "oneplus",
    name: "OnePlus Nord 4",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "OnePlus Store", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Xiaomi ────────────────────────────────────────────────────────────────
  {
    id: "xiaomi-15-ultra",
    brandId: "xiaomi",
    name: "Xiaomi 15 Ultra",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "xiaomi-15-pro",
    brandId: "xiaomi",
    name: "Xiaomi 15 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "xiaomi-14-ultra",
    brandId: "xiaomi",
    name: "Xiaomi 14 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Xiaomi Specs", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "xiaomi-14",
    brandId: "xiaomi",
    name: "Xiaomi 14",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1200, height: 2670 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "xiaomi-mix-fold-4",
    brandId: "xiaomi",
    name: "Xiaomi Mix Fold 4",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Inner Display", width: 2048, height: 2160 },
      { id: "cover", name: "Cover Display", width: 1080, height: 2520 },
    ],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Redmi ─────────────────────────────────────────────────────────────────
  {
    id: "redmi-note-14-pro-plus",
    brandId: "redmi",
    name: "Redmi Note 14 Pro+",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "redmi-note-14-pro",
    brandId: "redmi",
    name: "Redmi Note 14 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "redmi-k70-ultra",
    brandId: "redmi",
    name: "Redmi K70 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "redmi-13c",
    brandId: "redmi",
    name: "Redmi 13C",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 720, height: 1600 }],
    sources: [{ name: "Xiaomi Global", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Poco ──────────────────────────────────────────────────────────────────
  {
    id: "poco-x7-pro",
    brandId: "poco",
    name: "Poco X7 Pro",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Poco Global", url: "https://www.po.co" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "poco-f6-pro",
    brandId: "poco",
    name: "Poco F6 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3200 }],
    sources: [{ name: "Poco Global", url: "https://www.po.co" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "poco-f6",
    brandId: "poco",
    name: "Poco F6",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Poco Global", url: "https://www.po.co" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "poco-m6-pro",
    brandId: "poco",
    name: "Poco M6 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Poco Global", url: "https://www.po.co" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Motorola ──────────────────────────────────────────────────────────────
  {
    id: "motorola-razr-plus-2024",
    brandId: "motorola",
    name: "Motorola Razr+ 2024",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1080, height: 2640 },
      { id: "cover", name: "Cover Display", width: 1056, height: 1066 },
    ],
    sources: [{ name: "Motorola Store", url: "https://www.motorola.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "motorola-edge-50-ultra",
    brandId: "motorola",
    name: "Motorola Edge 50 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2712 }],
    sources: [{ name: "Motorola Store", url: "https://www.motorola.com" }],
    verifiedAt: "2026-07-23",
  },
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
  {
    id: "motorola-g85",
    brandId: "motorola",
    name: "Motorola Moto G85",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Motorola Store", url: "https://www.motorola.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "motorola-razr-2024",
    brandId: "motorola",
    name: "Motorola Razr 2024",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Main Display", width: 1080, height: 2640 },
      { id: "cover", name: "Cover Display", width: 1056, height: 1066 },
    ],
    sources: [{ name: "Motorola Store", url: "https://www.motorola.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Nothing ───────────────────────────────────────────────────────────────
  {
    id: "nothing-phone-3a-pro",
    brandId: "nothing",
    name: "Nothing Phone (3a) Pro",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Nothing Tech", url: "https://nothing.tech" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "nothing-phone-3a",
    brandId: "nothing",
    name: "Nothing Phone (3a)",
    releaseYear: 2025,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Nothing Tech", url: "https://nothing.tech" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "nothing-phone-2a-plus",
    brandId: "nothing",
    name: "Nothing Phone (2a) Plus",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Nothing Tech", url: "https://nothing.tech" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "nothing-phone-2a",
    brandId: "nothing",
    name: "Nothing Phone (2a)",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Nothing Tech", url: "https://nothing.tech" }],
    verifiedAt: "2026-07-23",
  },
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

  // ─── Oppo ──────────────────────────────────────────────────────────────────
  {
    id: "oppo-find-x8-pro",
    brandId: "oppo",
    name: "Oppo Find X8 Pro",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1264, height: 2780 }],
    sources: [{ name: "Oppo Specs", url: "https://www.oppo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oppo-find-x8",
    brandId: "oppo",
    name: "Oppo Find X8",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2376 }],
    sources: [{ name: "Oppo Specs", url: "https://www.oppo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oppo-find-n3",
    brandId: "oppo",
    name: "Oppo Find N3",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [
      { id: "main", name: "Inner Display", width: 2120, height: 2426 },
      { id: "cover", name: "Cover Display", width: 1080, height: 2484 },
    ],
    sources: [{ name: "Oppo Specs", url: "https://www.oppo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "oppo-reno-12-pro",
    brandId: "oppo",
    name: "Oppo Reno 12 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Oppo Specs", url: "https://www.oppo.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Vivo ──────────────────────────────────────────────────────────────────
  {
    id: "vivo-x200-ultra",
    brandId: "vivo",
    name: "Vivo X200 Ultra",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1260, height: 2800 }],
    sources: [{ name: "Vivo Specs", url: "https://www.vivo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "vivo-x200-pro",
    brandId: "vivo",
    name: "Vivo X200 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1260, height: 2800 }],
    sources: [{ name: "Vivo Specs", url: "https://www.vivo.com" }],
    verifiedAt: "2026-07-23",
  },
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
  {
    id: "vivo-v30-pro",
    brandId: "vivo",
    name: "Vivo V30 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2376 }],
    sources: [{ name: "Vivo Specs", url: "https://www.vivo.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── iQOO ──────────────────────────────────────────────────────────────────
  {
    id: "iqoo-13",
    brandId: "iqoo",
    name: "iQOO 13",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "iQOO Global", url: "https://www.iqoo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iqoo-12",
    brandId: "iqoo",
    name: "iQOO 12",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1440, height: 3168 }],
    sources: [{ name: "iQOO Global", url: "https://www.iqoo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iqoo-neo-9-pro",
    brandId: "iqoo",
    name: "iQOO Neo 9 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1260, height: 2800 }],
    sources: [{ name: "iQOO Global", url: "https://www.iqoo.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "iqoo-z9-turbo",
    brandId: "iqoo",
    name: "iQOO Z9 Turbo",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "iQOO Global", url: "https://www.iqoo.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Honor ─────────────────────────────────────────────────────────────────
  {
    id: "honor-magic-7-pro",
    brandId: "honor",
    name: "Honor Magic7 Pro",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1280, height: 2800 }],
    sources: [{ name: "Honor Specs", url: "https://www.hihonor.com" }],
    verifiedAt: "2026-07-23",
  },
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
  {
    id: "honor-200-pro",
    brandId: "honor",
    name: "Honor 200 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1220, height: 2700 }],
    sources: [{ name: "Honor Specs", url: "https://www.hihonor.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "honor-x9b",
    brandId: "honor",
    name: "Honor X9b",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Honor Specs", url: "https://www.hihonor.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Sony ──────────────────────────────────────────────────────────────────
  {
    id: "sony-xperia-1-vi",
    brandId: "sony",
    name: "Sony Xperia 1 VI",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Sony Specs", url: "https://www.sony.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "sony-xperia-5-vi",
    brandId: "sony",
    name: "Sony Xperia 5 VI",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2340 }],
    sources: [{ name: "Sony Specs", url: "https://www.sony.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "sony-xperia-10-vi",
    brandId: "sony",
    name: "Sony Xperia 10 VI",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2520 }],
    sources: [{ name: "Sony Specs", url: "https://www.sony.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Asus ──────────────────────────────────────────────────────────────────
  {
    id: "asus-rog-phone-9-pro",
    brandId: "asus",
    name: "Asus ROG Phone 9 Pro",
    releaseYear: 2025,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Asus Specs", url: "https://www.asus.com" }],
    verifiedAt: "2026-07-23",
  },
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
  {
    id: "asus-zenfone-11-ultra",
    brandId: "asus",
    name: "Asus Zenfone 11 Ultra",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Asus Specs", url: "https://www.asus.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "asus-zenfone-10",
    brandId: "asus",
    name: "Asus Zenfone 10",
    releaseYear: 2023,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Asus Specs", url: "https://www.asus.com" }],
    verifiedAt: "2026-07-23",
  },

  // ─── Realme ────────────────────────────────────────────────────────────────
  {
    id: "realme-gt-7-pro",
    brandId: "realme",
    name: "Realme GT 7 Pro",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1264, height: 2780 }],
    sources: [{ name: "Realme Global", url: "https://www.realme.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "realme-gt-6",
    brandId: "realme",
    name: "Realme GT 6",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1264, height: 2780 }],
    sources: [{ name: "Realme Global", url: "https://www.realme.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "realme-12-pro-plus",
    brandId: "realme",
    name: "Realme 12 Pro+",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2412 }],
    sources: [{ name: "Realme Global", url: "https://www.realme.com" }],
    verifiedAt: "2026-07-23",
  },
  {
    id: "realme-narzo-70-pro",
    brandId: "realme",
    name: "Realme Narzo 70 Pro",
    releaseYear: 2024,
    status: "current",
    frame: "android",
    displays: [{ id: "main", name: "Main Display", width: 1080, height: 2400 }],
    sources: [{ name: "Realme Global", url: "https://www.realme.com" }],
    verifiedAt: "2026-07-23",
  },
];

// ─── Provider & Utilities ──────────────────────────────────────────────────────

export interface DeviceCatalogueFeed {
  lastUpdated: string;
  source: string;
  models: PhoneModel[];
}

/**
 * DeviceCatalogueProvider bundles the local catalogue and provides a
 * source-agnostic sync boundary for future server-side feeds.
 *
 * Server-side sync adapter interface (for future use):
 * ```ts
 * type ExternalFeedAdapter = {
 *   fetch(): Promise<DeviceCatalogueFeed>;
 *   validate(feed: DeviceCatalogueFeed): boolean;
 * };
 * ```
 * Pass an adapter to `syncExternalFeed` to merge validated remote data.
 */
export class DeviceCatalogueProvider {
  private feed: DeviceCatalogueFeed;

  constructor(initialFeed?: Partial<DeviceCatalogueFeed>) {
    this.feed = {
      lastUpdated: initialFeed?.lastUpdated ?? "2026-07-23T20:00:00Z",
      source: initialFeed?.source ?? "wallmydevice-bundled-v3",
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
    // Sort newest first within each brand group, then by brand, then by name
    return (valid.length > 0 ? valid : PHONE_MODELS).sort((a, b) => {
      if (b.releaseYear !== a.releaseYear) return b.releaseYear - a.releaseYear;
      return a.name.localeCompare(b.name);
    });
  }

  public getFeed(): DeviceCatalogueFeed {
    return this.feed;
  }

  public getModels(): PhoneModel[] {
    return this.feed.models;
  }

  /**
   * Merge a validated external feed. Safe to call on the server.
   * Returns true if the merge succeeded.
   */
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
  return defaultCatalogueProvider.getModels().filter(m => m.brandId === (brandId as PhoneBrandId));
}

export function findModel(id: string): PhoneModel | undefined {
  return defaultCatalogueProvider.getModels().find(m => m.id === id);
}

export function findDisplay(modelId: string, displayId: string): PhoneDisplay | undefined {
  const model = findModel(modelId);
  return model?.displays.find(d => d.id === displayId);
}
