/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f7ff',
          100: '#e0effe',
          800: '#0f2942',
          900: '#0b1d30',
          950: '#061321'
        },
        teal: {
          500: '#0d9488',
          600: '#0d7490'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}
