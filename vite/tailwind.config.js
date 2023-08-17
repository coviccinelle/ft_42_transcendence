/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", //enable dark mode on the class dark added to the html element
  theme: {
    extend: {
      animation: {
        text: 'text 5s ease infinite',
      },
      keyframes: {
        text: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
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
