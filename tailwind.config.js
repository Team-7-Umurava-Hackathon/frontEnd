/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E73F1",
        lightBlue: "#EFF6FE",
        softYellow: "#FFFDE8",
        background: "#FDFDFE",
      },
      fontFamily: {
  sans: ["Work Sans", "sans-serif"],
},
    },
  },
  plugins: [],
};