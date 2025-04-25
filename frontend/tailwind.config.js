/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3a86ff',
          light: '#70a8ff',
          dark: '#2b6edb',
        },
        secondary: {
          DEFAULT: '#805ad5',
          light: '#a988e0',
          dark: '#6941b5',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf4c',
          dark: '#d97706',
        },
        success: {
          DEFAULT: '#38a169',
          light: '#68d391',
          dark: '#2c7a50',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fbbf4c',
          dark: '#d97706',
        },
        error: {
          DEFAULT: '#e53e3e',
          light: '#fc8181',
          dark: '#c53030',
        },
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        ripple: 'ripple 600ms linear',
      },
    },
  },
  plugins: [],
};