/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      skew: {
        '15': '15deg',
      }
    },
  },
  plugins: [],
}

