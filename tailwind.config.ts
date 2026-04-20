import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Fonts ────────────────────────────────────────────────────────────
      fontFamily: {
        serif: ['var(--font-crimson)', 'Georgia', 'Times New Roman', 'serif'],
        sans:  ['var(--font-inter)',   'system-ui', 'sans-serif'],
      },

      // ── Color Palette ─────────────────────────────────────────────────────
      colors: {
        // Deep navy — primary brand color
        navy: {
          50:  '#f0f4f9',
          100: '#dce6f0',
          200: '#b9cde2',
          300: '#8aadc8',
          400: '#5b8aad',
          500: '#3a6a90',
          600: '#2d5278',
          700: '#1e3a5f',  // ← primary brand navy
          800: '#162d4a',
          900: '#0e1e33',
          950: '#070f1c',
        },

        // Gold — accent color for highlights, links, badges
        gold: {
          50:  '#fdf9ed',
          100: '#faf0cc',
          200: '#f5df9e',
          300: '#edc96a',
          400: '#c9a84c',  // ← primary gold accent
          500: '#b08a32',
          600: '#8c6d24',
          700: '#6b521a',
          800: '#4e3c13',
          900: '#33270c',
          950: '#1a1406',
        },

        // Slate — secondary text, borders, muted elements
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },

        // Warm background tones — site background and surfaces
        warm: {
          50:  '#faf8f5',  // ← site background
          100: '#f4f0ea',
          200: '#ebe4d8',
          300: '#ddd3c3',
          400: '#c8b89d',
          500: '#b09a7a',
        },
      },

      // ── Typography Scale ──────────────────────────────────────────────────
      fontSize: {
        'display':    ['3.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'headline':   ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'title':      ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '-0.005em' }],
        'subtitle':   ['1.125rem',{ lineHeight: '1.4'  }],
        'body-lg':    ['1.0625rem',{ lineHeight: '1.75' }],
        'body':       ['1rem',    { lineHeight: '1.7'  }],
        'body-sm':    ['0.9375rem',{ lineHeight: '1.65' }],
        'caption':    ['0.8125rem',{ lineHeight: '1.5'  }],
        'label':      ['0.75rem', { lineHeight: '1.4',  letterSpacing: '0.06em' }],
      },

      // ── Spacing ───────────────────────────────────────────────────────────
      maxWidth: {
        'prose-narrow': '60ch',
        'prose':        '72ch',
        'content':      '80rem',
        'site':         '72rem',
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(30, 58, 95, 0.06), 0 1px 2px -1px rgba(30, 58, 95, 0.04)',
        'card-md': '0 4px 12px 0 rgba(30, 58, 95, 0.08), 0 2px 4px -1px rgba(30, 58, 95, 0.05)',
        'card-lg': '0 8px 24px 0 rgba(30, 58, 95, 0.10), 0 4px 8px -2px rgba(30, 58, 95, 0.06)',
        'gold':    '0 0 0 3px rgba(201, 168, 76, 0.25)',
        'navy':    '0 0 0 3px rgba(30, 58, 95, 0.20)',
      },

      // ── Border Radius ─────────────────────────────────────────────────────
      borderRadius: {
        'sm':  '0.25rem',
        'md':  '0.375rem',
        'lg':  '0.5rem',
        'xl':  '0.75rem',
        '2xl': '1rem',
      },

      // ── Transitions ───────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '200ms',
        fast:    '150ms',
        slow:    '300ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
