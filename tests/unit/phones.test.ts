import { describe, it, expect } from 'vitest';
import { PHONE_MODELS } from '@/lib/devices/phones';

describe('Phone catalogue integrity', () => {
  it('has unique model ids', () => {
    const ids = PHONE_MODELS.map(p => p.id);
    const uniq = new Set(ids);
    expect(uniq.size).toBe(ids.length);
  });

  it('each phone has at least one display with unique ids', () => {
    for (const m of PHONE_MODELS) {
      expect(m.displays.length).toBeGreaterThan(0);
      const dids = m.displays.map(d => d.id);
      expect(new Set(dids).size).toBe(dids.length);
      for (const d of m.displays) {
        expect(Number.isInteger(d.width)).toBe(true);
        expect(Number.isInteger(d.height)).toBe(true);
        expect(d.width).toBeGreaterThan(0);
        expect(d.height).toBeGreaterThan(0);
        // portrait constraint
        expect(Math.min(d.width, d.height)).toBe(d.width);
        expect(Math.max(d.width, d.height)).toBe(d.height);
      }
    }
  });

  it('each phone has sources and verifiedAt', () => {
    for (const m of PHONE_MODELS) {
      expect(Array.isArray(m.sources)).toBe(true);
      expect(m.sources.length).toBeGreaterThan(0);
      expect(typeof m.verifiedAt).toBe('string');
      expect(m.verifiedAt.length).toBeGreaterThan(0);
    }
  });
});
