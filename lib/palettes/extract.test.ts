import { describe, it, expect } from "vitest";
import { extractPalette } from "./extract";

function makeImageData(w: number, h: number, fill: [number, number, number]): ImageData {
  const d = new ImageData(w, h);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i] = fill[0];
    d.data[i + 1] = fill[1];
    d.data[i + 2] = fill[2];
    d.data[i + 3] = 255;
  }
  return d;
}

describe("extractPalette", () => {
  it("returns 5 valid hex colors from a uniform image", () => {
    const colors = extractPalette(makeImageData(64, 64, [200, 100, 50]));
    expect(colors.length).toBe(5);
    for (const c of colors) expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("returns distinct colors from a multi-region image", () => {
    const img = new ImageData(64, 64);
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4;
        if (x < 32) { img.data[i] = 255; img.data[i + 1] = 0; img.data[i + 2] = 0; }
        else        { img.data[i] = 0; img.data[i + 1] = 0; img.data[i + 2] = 255; }
        img.data[i + 3] = 255;
      }
    }
    const colors = extractPalette(img);
    expect(colors.length).toBe(5);
    const set = new Set(colors.map(c => c.toLowerCase()));
    expect(set.size).toBeGreaterThan(1);
  });
});
