/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          800: "#262D34",
          700: "#2C353D",
          600: "#1E252B",
          500: "#858EAD",
        },
        white: {
          100: "#F7f7f7",
        },
        blue: {
          100: "#094F8E",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "#1E252B",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#2C353D",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1E252B",
            borderRadius: "5px",
            border: "1px solid #2C353D",
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
