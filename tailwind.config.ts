import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#05060a',
        foreground: '#f8fafc',
        gold: '#d7b56d',
        saffron: '#f59e0b',
      },
      boxShadow: { glow: '0 0 80px rgba(215,181,109,.18)' },
    },
  },
};
export default config;
