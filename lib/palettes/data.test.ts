import { describe, it, expect } from 'vitest';
import { CURATED_PALETTES, findPalette, palettesForMode } from './data';

describe('CURATED_PALETTES', () => {
  it('has at least 8 palettes', () => {
    expect(CURATED_PALETTES.length).toBeGreaterThanOrEqual(8);
  });

  it('every palette has 2-6 colors', () => {
    for (const p of CURATED_PALETTES) {
      expect(p.colors.length).toBeGreaterThanOrEqual(2);
      expect(p.colors.length).toBeLessThanOrEqual(6);
    }
  });

  it('every color is a valid 6-digit hex', () => {
    const hex = /^#[0-9a-fA-F]{6}$/;
    for (const p of CURATED_PALETTES) {
      for (const c of p.colors) expect(c).toMatch(hex);
    }
  });

  it('every palette has a valid mode tag', () => {
    for (const p of CURATED_PALETTES) {
      expect(['light', 'dark', 'both']).toContain(p.mode);
    }
  });
});

describe('findPalette', () => {
  it('returns the palette by id', () => {
    const p = findPalette(CURATED_PALETTES[0].id);
    expect(p?.id).toBe(CURATED_PALETTES[0].id);
  });

  it('returns undefined for unknown id', () => {
    expect(findPalette('does-not-exist')).toBeUndefined();
  });
});

describe('palettesForMode', () => {
  it('includes palettes tagged dark or both for dark mode', () => {
    const list = palettesForMode('dark');
    expect(list.every(p => p.mode === 'dark' || p.mode === 'both')).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('includes palettes tagged light or both for light mode', () => {
    const list = palettesForMode('light');
    expect(list.every(p => p.mode === 'light' || p.mode === 'both')).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });
});
