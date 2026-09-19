/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7f6",
          100: "#dcece9",
          200: "#b9d9d3",
          300: "#8fc0b6",
          400: "#5fa296",
          500: "#3d8478",
          600: "#2d6a60",
          700: "#26564f",
          800: "#214540",
          900: "#1c3936",
          950: "#0d201e",
        },
        sand: {
          50: "#faf9f6",
          100: "#f4f1ea",
          200: "#e8e1d3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px -8px rgba(23, 60, 55, 0.15)",
        card: "0 4px 20px -4px rgba(23, 60, 55, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
