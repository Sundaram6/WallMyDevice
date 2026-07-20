function rgbToHex(r: number, g: number, b: number): string {
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function quantize(v: number, step = 32): number {
  return Math.round(v / step) * step;
}

export function extractPalette(image: ImageData, count = 5): string[] {
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < image.data.length; i += 4) {
    const r = quantize(image.data[i]);
    const g = quantize(image.data[i + 1]);
    const b = quantize(image.data[i + 2]);
    const key = `${r},${g},${b}`;
    const cur = buckets.get(key);
    if (cur) cur.n++;
    else buckets.set(key, { r, g, b, n: 1 });
  }
  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  const result = sorted.slice(0, count).map(c => rgbToHex(c.r, c.g, c.b));
  while (result.length < count) {
    result.push(result[0] ?? "#000000");
  }
  return result;
}
