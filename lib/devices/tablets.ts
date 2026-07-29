export type TabletDisplay = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export type TabletBrandId =
  | "apple"
  | "samsung"
  | "xiaomi"
  | "redmi"
  | "oneplus"
  | "lenovo"
  | "huawei"
  | "honor";

export type TabletModel = {
  id: string;
  brandId: TabletBrandId;
  name: string;
  releaseYear: number;
  status: "current" | "previous";
  featured?: boolean;
  frame: "ipad" | "tablet";
  displays: TabletDisplay[];
  sources: Array<{ name: string; url: string }>;
  verifiedAt: string;
};

export const TABLET_BRANDS: Array<{ id: TabletBrandId; label: string }> = [
  { id: "apple", label: "Apple" },
  { id: "samsung", label: "Samsung" },
  { id: "xiaomi", label: "Xiaomi" },
  { id: "redmi", label: "Redmi" },
  { id: "oneplus", label: "OnePlus" },
  { id: "lenovo", label: "Lenovo" },
  { id: "huawei", label: "Huawei" },
  { id: "honor", label: "Honor" },
];

export const TABLET_MODELS: TabletModel[] = [
  // ─── Apple iPads ─────────────────────────────────────────────────────────────
  {
    id: "ipad-pro-13-m4",
    brandId: "apple",
    name: 'iPad Pro 13" (M4)',
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "ipad",
    displays: [{ id: "main", name: "Ultra Retina XDR", width: 2064, height: 2752 }],
    sources: [{ name: "Apple Specs", url: "https://www.apple.com/ipad-pro/specs/" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "ipad-pro-11-m4",
    brandId: "apple",
    name: 'iPad Pro 11" (M4)',
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "ipad",
    displays: [{ id: "main", name: "Ultra Retina XDR", width: 1668, height: 2420 }],
    sources: [{ name: "Apple Specs", url: "https://www.apple.com/ipad-pro/specs/" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "ipad-air-13-m2",
    brandId: "apple",
    name: 'iPad Air 13" (M2)',
    releaseYear: 2024,
    status: "current",
    frame: "ipad",
    displays: [{ id: "main", name: "Liquid Retina", width: 2048, height: 2732 }],
    sources: [{ name: "Apple Specs", url: "https://www.apple.com/ipad-air/specs/" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "ipad-mini-7",
    brandId: "apple",
    name: "iPad mini (A17 Pro)",
    releaseYear: 2024,
    status: "current",
    frame: "ipad",
    displays: [{ id: "main", name: "Liquid Retina", width: 1488, height: 2266 }],
    sources: [{ name: "Apple Specs", url: "https://www.apple.com/ipad-mini/specs/" }],
    verifiedAt: "2026-07-28",
  },

  // ─── Samsung Galaxy Tabs ──────────────────────────────────────────────────
  {
    id: "samsung-tab-s10-ultra",
    brandId: "samsung",
    name: "Galaxy Tab S10 Ultra",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "tablet",
    displays: [{ id: "main", name: '14.6" Dynamic AMOLED 2X', width: 1848, height: 2960 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "samsung-tab-s10-plus",
    brandId: "samsung",
    name: "Galaxy Tab S10+",
    releaseYear: 2024,
    status: "current",
    frame: "tablet",
    displays: [{ id: "main", name: '12.4" Dynamic AMOLED 2X', width: 1752, height: 2800 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "samsung-tab-s9-fe",
    brandId: "samsung",
    name: "Galaxy Tab S9 FE",
    releaseYear: 2023,
    status: "previous",
    frame: "tablet",
    displays: [{ id: "main", name: '10.9" LCD', width: 1440, height: 2304 }],
    sources: [{ name: "Samsung Specs", url: "https://www.samsung.com" }],
    verifiedAt: "2026-07-28",
  },

  // ─── Xiaomi & Redmi Tabs ──────────────────────────────────────────────────
  {
    id: "xiaomi-pad-6s-pro",
    brandId: "xiaomi",
    name: 'Xiaomi Pad 6S Pro 12.4"',
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "tablet",
    displays: [{ id: "main", name: "3K 144Hz Display", width: 2032, height: 3048 }],
    sources: [{ name: "Mi Specs", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "redmi-pad-pro",
    brandId: "redmi",
    name: "Redmi Pad Pro",
    releaseYear: 2024,
    status: "current",
    frame: "tablet",
    displays: [{ id: "main", name: '12.1" 2.5K Display', width: 1600, height: 2560 }],
    sources: [{ name: "Mi Specs", url: "https://www.mi.com" }],
    verifiedAt: "2026-07-28",
  },

  // ─── OnePlus ─────────────────────────────────────────────────────────────
  {
    id: "oneplus-pad-2",
    brandId: "oneplus",
    name: "OnePlus Pad 2",
    releaseYear: 2024,
    status: "current",
    featured: true,
    frame: "tablet",
    displays: [{ id: "main", name: '12.1" 3K 3:2 Display', width: 2120, height: 3000 }],
    sources: [{ name: "OnePlus Specs", url: "https://www.oneplus.com" }],
    verifiedAt: "2026-07-28",
  },

  // ─── Lenovo ──────────────────────────────────────────────────────────────
  {
    id: "lenovo-tab-extreme",
    brandId: "lenovo",
    name: "Lenovo Tab Extreme",
    releaseYear: 2023,
    status: "current",
    frame: "tablet",
    displays: [{ id: "main", name: '14.5" 3K OLED', width: 1876, height: 3000 }],
    sources: [{ name: "Lenovo Specs", url: "https://www.lenovo.com" }],
    verifiedAt: "2026-07-28",
  },

  // ─── Huawei & Honor ──────────────────────────────────────────────────────
  {
    id: "huawei-matepad-pro-13-2",
    brandId: "huawei",
    name: 'Huawei MatePad Pro 13.2"',
    releaseYear: 2024,
    status: "current",
    frame: "tablet",
    displays: [{ id: "main", name: "OLED PaperMatte", width: 1920, height: 2880 }],
    sources: [{ name: "Huawei Specs", url: "https://consumer.huawei.com" }],
    verifiedAt: "2026-07-28",
  },
  {
    id: "honor-magicpad-2",
    brandId: "honor",
    name: 'Honor MagicPad 2 12.3"',
    releaseYear: 2024,
    status: "current",
    frame: "tablet",
    displays: [{ id: "main", name: "144Hz OLED", width: 1920, height: 3000 }],
    sources: [{ name: "Honor Specs", url: "https://www.hihonor.com" }],
    verifiedAt: "2026-07-28",
  },
];
