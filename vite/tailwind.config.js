/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", //enable dark mode on the class dark added to the html element
  theme: {
    extend: {
      colors: {
        dark: "#e44d12",
      },
      skew: {
        '15': '15deg',
      },
      height: {
        'screen-92': '92vh',
      },
      width: {
        'screen-92': '92vw',
      },
    },
  },
  plugins: [],
}