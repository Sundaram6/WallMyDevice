import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(59 130 246 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
