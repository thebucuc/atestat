/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        "columbia-blue": "#BBDEF0",
        "light-sea-green":"#00A6A6",
        "nice-yellow":"#EFCA08",
        "nice-orange":"#F49F0A",
        "tangerine": "#F49F0A",
        "darkbg": "#2b2d30"
      }
    },
  },
  plugins: [],
}
