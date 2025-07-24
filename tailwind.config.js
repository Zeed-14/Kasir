/** @type {import('tailwindcss').Config} */
module.exports = {
  // Versi 2 (purge)
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // <-- TAMBAHKAN BARIS INI
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}