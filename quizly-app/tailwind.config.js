/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.js",
    "./app/*/*.{js,jsx,ts,tsx}",
    "./components/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      textColor: {
        buttoncolor: "2B4E7B",
        LightTextcolor: "#9E9191",
      },



      backgroundColor: {
        bottomlayer:"6A5AE0"
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
