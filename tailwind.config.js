const { design } = require('./src/constants/design');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        app: design.colors,
      },
      borderRadius: {
        app: `${design.radius.lg}px`,
        'app-sm': `${design.radius.sm}px`,
        'app-md': `${design.radius.md}px`,
      },
      spacing: {
        'app-xs': `${design.spacing.xs}px`,
        'app-sm': `${design.spacing.sm}px`,
        'app-md': `${design.spacing.md}px`,
        'app-lg': `${design.spacing.lg}px`,
        'app-xl': `${design.spacing.xl}px`,
        'screen-x': `${design.spacing.screenX}px`,
        'screen-y': `${design.spacing.screenY}px`,
      },
    },
  },
  plugins: [],
};
