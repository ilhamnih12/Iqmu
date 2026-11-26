/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        surface: {
          light: 'rgba(255,255,255,0.62)',
          dark: 'rgba(15,23,42,0.55)',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(15, 23, 42, 0.12)',
        'glass-lg': '0 20px 60px rgba(15, 23, 42, 0.18)',
        glow: '0 0 40px rgba(99, 102, 241, 0.35)',
      },
      keyframes: {
        'mesh-float-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(60px, -40px) scale(1.08)' },
          '66%': { transform: 'translate(-40px, 30px) scale(0.95)' },
        },
        'mesh-float-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-70px, 50px) scale(1.12)' },
        },
        'mesh-float-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.05)' },
          '40%': { transform: 'translate(50px, 60px) scale(0.92)' },
          '75%': { transform: 'translate(-30px, -50px) scale(1.1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'mesh-1': 'mesh-float-1 26s ease-in-out infinite',
        'mesh-2': 'mesh-float-2 32s ease-in-out infinite',
        'mesh-3': 'mesh-float-3 38s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 1s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
