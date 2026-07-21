/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f1f0ff',
          100: '#e4e1ff',
          200: '#cbc5ff',
          300: '#aa9dff',
          400: '#8b6dff',
          500: '#7c4dff',
          600: '#6d28f5',
          700: '#5c1fd1',
          800: '#4b1ba8',
          900: '#3f1c86',
          950: '#26105a',
        },
        surface: {
          light: '#F7F7FB',
          dark: '#0B0E17',
        },
        panel: {
          light: '#FFFFFF',
          dark: '#12151F',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C4DFF 0%, #5C6BFF 50%, #4DD0E1 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(124,77,255,0.15) 0%, rgba(77,208,225,0.12) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' },
          '50%': { boxShadow: '0 0 0 6px rgba(34,197,94,0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
