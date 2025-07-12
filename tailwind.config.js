/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'Roboto', 'system-ui', 'sans-serif'],
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      colors: {
        'crypto-green': {
          50: '#f0fdf4',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          900: '#14532d',
        },
        'sports-orange': {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        'pitch-green': {
          400: '#10b981',
          500: '#059669',
          600: '#047857',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'sports-pattern': 'linear-gradient(45deg, rgba(16, 185, 129, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(16, 185, 129, 0.1) 25%, transparent 25%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-lg': '0 0 40px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}