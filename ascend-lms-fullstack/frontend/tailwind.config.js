/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#161320',
        primary: {
          50: '#f2f1fb',
          100: '#e5e3f7',
          200: '#c7c2ef',
          300: '#a79fe3',
          400: '#8a7fd6',
          500: '#6c5ce7',
          600: '#5642d6',
          700: '#4433b0',
          800: '#372a8c',
          900: '#2b2170'
        },
        accent: {
          400: '#f5b942',
          500: '#eea425'
        },
        surface: '#faf9fd'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(22,19,32,0.04), 0 1px 6px -1px rgba(22,19,32,0.06)',
        soft: '0 8px 30px -8px rgba(86,66,214,0.25)',
        glow: '0 0 0 1px rgba(108,92,231,0.08), 0 8px 24px -6px rgba(108,92,231,0.25)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};
