import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        code: ['ui-monospace', '"Cascadia Code"', '"Source Code Pro"', 'Menlo', 'Consolas', 'monospace'],
        mono: ['ui-monospace', '"Cascadia Code"', '"Source Code Pro"', 'Menlo', 'Consolas', 'monospace'],
      },
      colors: {
        // Dark theme (default)
        'bg-root': 'var(--bg-root)',
        'bg-surface': 'var(--bg-surface)',
        'bg-raised': 'var(--bg-raised)',
        'bg-editor': 'var(--bg-editor)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-faint': 'var(--text-faint)',
        'text-ghost': 'var(--text-ghost)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        orange: 'var(--orange)',
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
      },
      // Tier colors
      backgroundColor: {
        'tier-1': '#34d399',
        'tier-2': '#60a5fa',
        'tier-3': '#818cf8',
        'tier-4': '#c084fc',
        'tier-5': '#f472b6',
      },
    },
  },
  plugins: [],
};

export default config;
