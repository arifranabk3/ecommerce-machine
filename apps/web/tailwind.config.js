const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f5',
          100: '#e1ede8',
          200: '#c5dcd3',
          300: '#A9C2B9', // Locked Primary Brand Accent
          400: '#8ca79d',
          500: '#718c82',
          600: '#587067',
          700: '#465952',
          800: '#394843',
          900: '#1A2328', // Dark Navy/Charcoal Typography
        },
        navy: {
          900: '#10171D',
          800: '#1A2328',
          700: '#253239',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
