/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', //enable dark mode on the class dark added to the html element
  theme: {
    extend: {
      backgroundImage: {
        flowery: "url('/assets/flower_field.jpg')",
        white_flower: "url('/assets/white_flower.jpg')",
        night_sky: "url('/assets/night_sky.jpg')",
        pattern:
          "url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')",
      },
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
        dark: '#e44d12',
      },
      skew: {
        15: '15deg',
      },
      height: {
        'screen-92': '92vh',
      },
      width: {
        'screen-92': '92vw',
      },
      spacing: {
        '1/2': '50%',
        '1/1': '100%',
      },
    },
  },
  plugins: [],
};
