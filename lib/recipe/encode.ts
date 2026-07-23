import pako from "pako";
import { parseRecipe, type Recipe } from "./validate";
export type { Recipe };

const HASH_PREFIX = "#r=";
const URL_RAW_LIMIT = 2048;

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeRecipe(recipe: Recipe): string {
  return JSON.stringify(recipe, null, 2);
}

export function encodeHash(recipe: Recipe): string {
  const json = JSON.stringify(recipe);
  const deflated = pako.deflate(json);
  const encoded = toBase64Url(deflated);
  if (encoded.length > URL_RAW_LIMIT) {
    throw new Error("Recipe too long for URL. Use file export instead.");
  }
  return HASH_PREFIX + encoded;
}

export function decodeHash(hash: string):
  | { ok: true; recipe: Recipe }
  | { ok: false; error: string } {
  if (!hash.startsWith(HASH_PREFIX)) return { ok: false, error: "Not a WallMyDevice URL" };
  const payload = hash.slice(HASH_PREFIX.length);
  try {
    const bytes = fromBase64Url(payload);
    const json = pako.inflate(bytes, { to: "string" });
    return parseRecipe(json);
  } catch (_e) {
    return { ok: false, error: "Could not decode URL" };
  }
}