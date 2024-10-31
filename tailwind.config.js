/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'main-bg-color': '#0D1117',
        'board-bg-color': '#161C22'
      }
    },
  },
  plugins: [],
}

