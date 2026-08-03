import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ui)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        accent: {
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
          100: 'var(--accent-100)',
          DEFAULT: 'var(--accent-500)',
        },
        paper: {
          0: 'var(--paper-0)',
          50: 'var(--paper-50)',
          100: 'var(--paper-100)',
          200: 'var(--paper-200)',
          300: 'var(--paper-300)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          400: 'var(--ink-400)',
        },
        stage: {
          950: 'var(--stage-950)',
          900: 'var(--stage-900)',
          800: 'var(--stage-800)',
          700: 'var(--stage-700)',
          'ink-100': 'var(--stage-ink-100)',
          'ink-400': 'var(--stage-ink-400)',
        },
        danger: {
          500: 'var(--danger-500)',
        },
        success: {
          500: 'var(--success-500)',
        },
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
          cream: 'var(--color-bg)',
        },
      },
      spacing: {
        'space-1': 'var(--space-1)',
        'space-2': 'var(--space-2)',
        'space-3': 'var(--space-3)',
        'space-4': 'var(--space-4)',
        'space-5': 'var(--space-5)',
        'space-6': 'var(--space-6)',
        'space-7': 'var(--space-7)',
        'space-8': 'var(--space-8)',
        'space-9': 'var(--space-9)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        glow: 'var(--shadow-glow)',
      },
      transitionDuration: {
        instant: 'var(--dur-instant)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
        canvas: 'var(--dur-canvas)',
      },
      transitionTimingFunction: {
        'ease-out-custom': 'var(--ease-out)',
        'ease-inout-custom': 'var(--ease-inout)',
        spring: 'var(--ease-spring)',
      },
    },
  },
  plugins: [],
};
export default config;
