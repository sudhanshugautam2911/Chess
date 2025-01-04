/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#81b64c",
        secondary: "#45753c",
        backgroundColor: "#312e2b",
        coordinateDark: '#739552',
        coordinateLight: '#ebecd0' 
      },
    },
  },
  plugins: [],
};
