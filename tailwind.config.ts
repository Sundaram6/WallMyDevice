import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        accent: 'rgb(59 130 246 / 0.1)',
        brand: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-2': 'var(--color-surface-2)',
          border: 'var(--color-border)',
          ink: 'var(--color-ink)',
          muted: 'var(--color-muted)',
          faint: 'var(--color-faint)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'card-bg': 'var(--color-card-bg)',
          'card-border': 'var(--color-card-border)',
          // Legacy fallbacks
          cream: 'var(--color-bg)',
        },
      },
    },
  },
  plugins: [],
};
export default config;
