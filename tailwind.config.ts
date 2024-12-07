import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  mode: 'jit',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
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

export default config
