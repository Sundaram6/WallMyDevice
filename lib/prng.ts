export function hashSeed(seed: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let out = "";
  let n = h;
  for (let i = 0; i < 8; i++) {
    out = (n % 36).toString(36) + out;
    n = Math.floor(n / 36) + 1;
  }
  return out;
}

export function deriveSeed(parentSeed: string, namespace: string): string {
  return hashSeed(JSON.stringify([parentSeed, namespace]));
}

export function createRng(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  if (s === 0) s = 1;
  return function mulberry32(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
