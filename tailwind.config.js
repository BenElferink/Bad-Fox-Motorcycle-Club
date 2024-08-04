/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: true,
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        landing: ['inset 0 0 1rem 0.5rem black'],
      },
      dropShadow: {
        landinglogo: ['0 0 4px rgb(255 255 255 / 0.5)'],
        footeritem: ['0 1px 0 rgb(255 255 255 / 0.5)'],
        loader: ['0 0 2px rgb(255 255 255 / 1)'],
      },
    },
  },
  plugins: [],
}

module.exports = config
