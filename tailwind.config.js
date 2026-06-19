/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        clay: {
          50: "#FDF8F3",
          100: "#F5EDE0",
          200: "#EADAC3",
          300: "#D4BC9A",
          400: "#C4956A",
          500: "#A87B52",
          600: "#8B6340",
          700: "#6E4D31",
          800: "#2C1810",
          900: "#1A0E08",
        },
        profit: {
          high: "#4CAF50",
          "high-light": "#E8F5E9",
          medium: "#FF9800",
          "medium-light": "#FFF3E0",
          low: "#E57373",
          "low-light": "#FFEBEE",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Noto Sans SC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
