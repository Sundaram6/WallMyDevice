export type PaletteMode = 'light' | 'dark' | 'both';
export type Palette = {
  id: string;
  label: string;
  colors: string[];
  mode: PaletteMode;
};

export const CURATED_PALETTES: Palette[] = [
  { id: 'midnight',  label: 'Midnight',  colors: ['#0f172a', '#1e293b', '#334155', '#94a3b8'], mode: 'dark' },
  { id: 'sunset',    label: 'Sunset',    colors: ['#1e1b4b', '#7c2d12', '#f59e0b', '#fbbf24'], mode: 'dark' },
  { id: 'forest',    label: 'Forest',    colors: ['#052e16', '#14532d', '#65a30d', '#bef264'], mode: 'dark' },
  { id: 'ocean',     label: 'Ocean',     colors: ['#082f49', '#0c4a6e', '#0284c7', '#7dd3fc'], mode: 'dark' },
  { id: 'mono-dark', label: 'Mono Dark', colors: ['#09090b', '#27272a', '#a1a1aa', '#fafafa'], mode: 'dark' },
  { id: 'paper',     label: 'Paper',     colors: ['#fafaf9', '#e7e5e4', '#a8a29e', '#1c1917'], mode: 'light' },
  { id: 'sand',      label: 'Sand',      colors: ['#fef3c7', '#fde68a', '#d97706', '#78350f'], mode: 'light' },
  { id: 'mint',      label: 'Mint',      colors: ['#ecfdf5', '#a7f3d0', '#10b981', '#064e3b'], mode: 'light' },
  { id: 'rose',      label: 'Rose',      colors: ['#fff1f2', '#fecdd3', '#fb7185', '#9f1239'], mode: 'light' },
  { id: 'duo',       label: 'Duo',       colors: ['#0f172a', '#fafafa'], mode: 'both' },
];

export function findPalette(id: string): Palette | undefined {
  return CURATED_PALETTES.find(p => p.id === id);
}

export function palettesForMode(mode: 'light' | 'dark'): Palette[] {
  return CURATED_PALETTES.filter(p => p.mode === mode || p.mode === 'both');
}
