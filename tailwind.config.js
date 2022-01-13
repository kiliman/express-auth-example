const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{js,ts,tsx,md,mdx}', './remix.config.js'],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.orange,
        cyan: colors.cyan,
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
