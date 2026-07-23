import { z } from "zod";

export const LIBRARY_STORAGE_KEY = "wallmydevice:library:v1";

// Legacy keys for migration
export const LEGACY_KEYS = {
  GUEST_USER: "wallmydevice:guestUser",
  FAVORITES_OLD: "wallmydevice:favorites",
  RECENT_VIEWED_OLD: "wallmydevice:recentlyViewed",
  RECIPES_OLD: "wallmydevice:savedRecipes",
  COLLECTIONS_OLD: "wallmydevice:collections",
};

export const SavedRecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  generatorId: z.string(),
  palette: z.array(z.string()),
  mode: z.enum(["light", "dark", "auto"]),
  seed: z.string(),
  params: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
});

export const WishlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  itemIds: z.array(z.string()),
  createdAt: z.string(),
});

export const LibrarySchema = z.object({
  version: z.literal(1),
  profileName: z.string(),
  favourites: z.array(z.string()),
  savedRecipes: z.array(SavedRecipeSchema),
  recentlyViewed: z.array(z.string()),
  recentlyGenerated: z.array(SavedRecipeSchema),
  wishlists: z.array(WishlistSchema),
  onboardingDismissed: z.boolean(),
});

export type SavedRecipe = z.infer<typeof SavedRecipeSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type LibraryData = z.infer<typeof LibrarySchema>;

export const DEFAULT_LIBRARY: LibraryData = {
  version: 1,
  profileName: "",
  favourites: [],
  savedRecipes: [],
  recentlyViewed: [],
  recentlyGenerated: [],
  wishlists: [],
  onboardingDismissed: false,
};

const RECENT_LIMIT = 30;

type Listener = (data: LibraryData) => void;
const listeners = new Set<Listener>();

let memoryLibrary: LibraryData = structuredClone(DEFAULT_LIBRARY);
let initialized = false;

function notifyListeners() {
  const detached = getDetachedLibrary();
  listeners.forEach((fn) => fn(detached));
}

function saveToStorage(data: LibraryData) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(data));
    }
  } catch {}
}

function migrateLegacyData(base: LibraryData): LibraryData {
  const result: LibraryData = structuredClone(base);
  if (typeof localStorage === "undefined") return result;

  try {
    // 1. Guest user migration (profile name, favourites, wishlists)
    const rawGuest = localStorage.getItem(LEGACY_KEYS.GUEST_USER);
    if (rawGuest) {
      try {
        const guest = JSON.parse(rawGuest);
        if (guest.name && typeof guest.name === "string" && !result.profileName) {
          result.profileName = guest.name;
        }
        if (Array.isArray(guest.favourites)) {
          result.favourites = Array.from(new Set([...result.favourites, ...guest.favourites]));
        }
        if (Array.isArray(guest.wishlists)) {
          for (const wl of guest.wishlists) {
            if (wl && wl.id && wl.name) {
              if (!result.wishlists.some((w) => w.id === wl.id)) {
                result.wishlists.push({
                  id: String(wl.id),
                  name: String(wl.name),
                  itemIds: Array.isArray(wl.itemIds) ? wl.itemIds.map(String) : [],
                  createdAt: wl.createdAt ? String(wl.createdAt) : new Date().toISOString(),
                });
              }
            }
          }
        }
      } catch {}
    }

    // 2. Old standalone favourites
    const rawFavs = localStorage.getItem(LEGACY_KEYS.FAVORITES_OLD);
    if (rawFavs) {
      try {
        const favs = JSON.parse(rawFavs);
        if (Array.isArray(favs)) {
          result.favourites = Array.from(new Set([...result.favourites, ...favs.map(String)]));
        }
      } catch {}
    }

    // 3. Old recently viewed
    const rawRecent = localStorage.getItem(LEGACY_KEYS.RECENT_VIEWED_OLD);
    if (rawRecent) {
      try {
        const recent = JSON.parse(rawRecent);
        if (Array.isArray(recent)) {
          result.recentlyViewed = Array.from(new Set([...recent.map(String), ...result.recentlyViewed])).slice(0, RECENT_LIMIT);
        }
      } catch {}
    }

    // 4. Old onboarding dismissal key
    const rawOnboarding = localStorage.getItem("wallmydevice:onboardingDismissed");
    if (rawOnboarding === "true") {
      result.onboardingDismissed = true;
    }
  } catch {}

  return result;
}

export function resetLibraryForTesting(): void {
  initialized = false;
  memoryLibrary = structuredClone(DEFAULT_LIBRARY);
}

export function initLibrary(): LibraryData {
  if (initialized && typeof window !== "undefined") {
    return getDetachedLibrary();
  }

  let loaded: LibraryData = structuredClone(DEFAULT_LIBRARY);

  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const parseResult = LibrarySchema.safeParse(parsed);
        if (parseResult.success) {
          loaded = parseResult.data;
        } else {
          // Attempt partial recovery if schema mismatch
          if (parsed && typeof parsed === "object") {
            loaded = {
              version: 1,
              profileName: typeof parsed.profileName === "string" ? parsed.profileName : "",
              favourites: Array.isArray(parsed.favourites) ? Array.from(new Set(parsed.favourites.map(String))) : [],
              savedRecipes: Array.isArray(parsed.savedRecipes) ? parsed.savedRecipes.filter((r: any) => r && r.id && r.name) : [],
              recentlyViewed: Array.isArray(parsed.recentlyViewed) ? Array.from(new Set(parsed.recentlyViewed.map(String))).slice(0, RECENT_LIMIT) : [],
              recentlyGenerated: Array.isArray(parsed.recentlyGenerated) ? parsed.recentlyGenerated.filter((r: any) => r && r.id) : [],
              wishlists: Array.isArray(parsed.wishlists) ? parsed.wishlists.filter((w: any) => w && w.id) : [],
              onboardingDismissed: Boolean(parsed.onboardingDismissed),
            };
          }
        }
      }
    } catch {}

    // Perform legacy migration
    loaded = migrateLegacyData(loaded);
    saveToStorage(loaded);
  }

  memoryLibrary = loaded;
  initialized = true;

  // Listen for storage events across browser tabs
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (e) => {
      if (e.key === LIBRARY_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const res = LibrarySchema.safeParse(parsed);
          if (res.success) {
            memoryLibrary = res.data;
            notifyListeners();
          }
        } catch {}
      }
    });
  }

  return getDetachedLibrary();
}

export function getDetachedLibrary(): LibraryData {
  return structuredClone(memoryLibrary);
}

export function subscribeLibrary(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setProfileName(name: string): LibraryData {
  initLibrary();
  memoryLibrary.profileName = name.trim();
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function toggleFavourite(id: string): LibraryData {
  initLibrary();
  const set = new Set(memoryLibrary.favourites);
  if (set.has(id)) {
    set.delete(id);
  } else {
    set.add(id);
  }
  memoryLibrary.favourites = Array.from(set);
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function addRecentlyViewed(id: string): LibraryData {
  initLibrary();
  const list = [id, ...memoryLibrary.recentlyViewed.filter((v) => v !== id)];
  memoryLibrary.recentlyViewed = list.slice(0, RECENT_LIMIT);
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function addRecentlyGenerated(recipe: Omit<SavedRecipe, "id" | "createdAt"> & { id?: string }): LibraryData {
  initLibrary();
  const entry: SavedRecipe = {
    id: recipe.id ?? Date.now().toString(36),
    name: recipe.name ?? `Generated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    generatorId: recipe.generatorId,
    palette: [...recipe.palette],
    mode: recipe.mode,
    seed: recipe.seed,
    params: { ...recipe.params },
    createdAt: new Date().toISOString(),
  };

  const list = [entry, ...memoryLibrary.recentlyGenerated.filter((r) => r.seed !== entry.seed || r.generatorId !== entry.generatorId)];
  memoryLibrary.recentlyGenerated = list.slice(0, RECENT_LIMIT);
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function saveRecipe(recipe: Omit<SavedRecipe, "id" | "createdAt"> & { id?: string; name: string }): LibraryData {
  initLibrary();
  const entry: SavedRecipe = {
    id: recipe.id ?? Date.now().toString(36),
    name: recipe.name,
    generatorId: recipe.generatorId,
    palette: [...recipe.palette],
    mode: recipe.mode,
    seed: recipe.seed,
    params: { ...recipe.params },
    createdAt: new Date().toISOString(),
  };

  memoryLibrary.savedRecipes = [entry, ...memoryLibrary.savedRecipes.filter((r) => r.id !== entry.id)];
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function createWishlist(name: string): LibraryData {
  initLibrary();
  const newWl: Wishlist = {
    id: Date.now().toString(36),
    name: name.trim(),
    itemIds: [],
    createdAt: new Date().toISOString(),
  };
  memoryLibrary.wishlists.push(newWl);
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function deleteWishlist(id: string): LibraryData {
  initLibrary();
  memoryLibrary.wishlists = memoryLibrary.wishlists.filter((w) => w.id !== id);
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}

export function setOnboardingDismissed(dismissed: boolean): LibraryData {
  initLibrary();
  memoryLibrary.onboardingDismissed = dismissed;
  saveToStorage(memoryLibrary);
  notifyListeners();
  return getDetachedLibrary();
}
