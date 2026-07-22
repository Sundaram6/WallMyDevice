import { z } from "zod";

export const LOCAL_STATE_KEY = "wallmydevice:lastState";

const SEED_RE = /^[0-9a-z]{1,16}$/;

export const LocalStateSchema = z.object({
  generatorId: z.string().min(1),
  params: z.record(z.string(), z.unknown()),
  palette: z.array(z.string()).min(1),
  mode: z.enum(["light", "dark", "auto"]),
  seed: z.string().regex(SEED_RE),
  grainEnabled: z.boolean(),
  grainIntensity: z.number().min(0).max(1),
  blurIntensity: z.number().min(0).max(1),
  resolutionId: z.string().min(1),
  customWidth: z.number().int().min(1).max(15360),
  customHeight: z.number().int().min(1).max(15360),
  aspectLock: z.boolean(),
  overlayClock: z.boolean(),
  overlayDate: z.boolean(),
  overlayText: z.boolean(),
  overlayTextValue: z.string().max(200),
  overlayFont: z.string().min(1),
  overlaySize: z.number().min(0.1).max(8),
  exportFormat: z.enum(["png", "jpg", "webp", "svg"]),
});

export type LocalState = z.infer<typeof LocalStateSchema>;

/**
 * Reads and validates the last-saved editor state from localStorage.
 * Returns null if nothing is stored, storage is unavailable, or the
 * stored payload doesn't match the current schema (e.g. saved by an
 * older app version).
 */
export function loadLocalState(): LocalState | null {
  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = LocalStateSchema.safeParse(parsed);
    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}

export function saveLocalState(state: LocalState): void {
  try {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — non-fatal.
  }
}

export function clearLocalState(): void {
  try {
    localStorage.removeItem(LOCAL_STATE_KEY);
  } catch {
    // no-op
  }
}
