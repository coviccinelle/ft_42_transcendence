/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", //enable dark mode on the class dark added to the html element
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1a202c',
      },
      skew: {
        '15': '15deg',
      },
    },
  },
  plugins: [],
}

