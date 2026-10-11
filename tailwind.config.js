/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#e31837",
          "red-dark": "#c1122f",
          "red-light": "#fef2f2",
          green: "#009640",
          "green-dark": "#007a33",
          navy: "#0f172a",
          dark: "#1e293b",
          gray: "#64748b",
          light: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
