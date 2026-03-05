import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f2f7f2",
          100: "#e0ede0",
          200: "#c2dcc2",
          300: "#96c296",
          400: "#62a062",
          500: "#3d7d3d",
          600: "#2e6330",
          700: "#254f27",
          800: "#1f4021",
          900: "#1a351c",
        },
        earth: {
          50: "#faf7f2",
          100: "#f5ede0",
          200: "#e8d5b7",
          300: "#d9b88a",
          400: "#c8955c",
          500: "#b87740",
          600: "#9a6035",
          700: "#7d4d2c",
          800: "#663f27",
          900: "#543424",
        },
        cream: "#faf8f4",
        sage: "#8fad88",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "check-draw": "checkDraw 0.6s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        checkDraw: {
          from: { strokeDashoffset: "100" },
          to: { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
