import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C6A15B",
          light: "#DDC38A",
          dark: "#9C7E3F",
        },
        ink: {
          DEFAULT: "#0B0B0C",
          soft: "#161618",
        },
        ivory: "#F7F5F1",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #DDC38A 0%, #C6A15B 50%, #9C7E3F 100%)",
      },
      boxShadow: {
        luxury: "0 20px 60px -15px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
