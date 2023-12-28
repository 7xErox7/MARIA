/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': '0 45px 45px rgba(0, 0, 0, 0.15)'
      },
      backgroundColor: {
        "erito": "#fff"
      }
    },
  },
  plugins: [],
}

