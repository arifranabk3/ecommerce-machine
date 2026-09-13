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
        background: '#F7F9FC',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          hover: '#F8FAFC',
          secondary: '#F1F3F8',
        },
        border: {
          DEFAULT: '#E5E7EB',
          subtle: '#F3F4F6',
        },
        content: {
          primary: '#111A3A',
          secondary: '#667085',
          muted: '#98A2B3',
        },
        brand: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#633BFF', // Primary Violet (matches prompt)
          700: '#6D45FF',
          800: '#4C1D95',
          900: '#2E1065',
        },
        accent: {
          DEFAULT: '#20C7E8', // Cyan
          hover: '#0891B2',
          subtle: 'rgba(32, 199, 232, 0.1)',
        },
        success: {
          DEFAULT: '#10B981', // green
          subtle: '#D1FAE5',
          text: '#047857'
        },
        warning: {
          DEFAULT: '#F59E0B', // amber
          subtle: '#FEF3C7',
          text: '#B45309'
        },
        danger: {
          DEFAULT: '#EF4444', // red
          subtle: '#FEE2E2',
          text: '#B91C1C'
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'premium-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
