/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      boxShadow: {
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'dark-hover': '0 8px 16px -2px rgba(255, 255, 255, 0.08)',
      },
      colors: {
        'bg-light': '#F7F8FA',
        'text-dark': '#2D2D2D',
        'accent-blue': '#4A69BD',
        'border-light': '#E0E0E0',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
        'dark-text': '#E0E1E3',
        'dark-text-secondary': '#A0A0A0',
        'dark-accent': '#4A69BD',
        'dark-border': '#2A2A2A',
        'dark-hover': 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
};
