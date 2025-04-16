/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core UI colors
        gray: {
          900: "#1A1F24", // Darkest background
          800: "#262D34", // Current gray-800
          700: "#2C353D", // Current gray-700
          600: "#1E252B", // Current gray-600
          500: "#858EAD", // Current gray-500
          400: "#A0AAC3", // Lighter text
          300: "#C5CEDE", // Subtle borders
          200: "#DFE4EE", // Light dividers
        },
        white: {
          100: "#F7F7F7", // Current white-100
        },
        // Primary brand color (expanded)
        blue: {
          900: "#053A68", // Darkest blue
          800: "#064272", // Darker blue
          700: "#074A7E", // Dark blue
          600: "#084C87", // Medium dark blue
          500: "#094F8E", // Current blue-100
          400: "#1A62A2", // Lighter blue
          300: "#3278B6", // Light blue
          200: "#5A94C8", // Highlights
          100: "#A7C3E1", // Subtle accents
        },
        // Additional functional colors
        success: {
          500: "#10B981", // Success messages/actions
          300: "#6EE7B7", // Light success
        },
        warning: {
          500: "#F59E0B", // Warnings/cautions
          300: "#FCD34D", // Light warning
        },
        error: {
          500: "#EF4444", // Error states
          300: "#FCA5A5", // Light error
        },
        info: {
          500: "#3B82F6", // Informational elements
          300: "#93C5FD", // Light info
        },
        // Theme colors
        primary: {
          light: "#ffffff",
          dark: "#212529",
        },
        secondary: {
          light: "#f8f9fa",
          dark: "#343a40",
        },
        tertiary: {
          light: "#e9ecef",
          dark: "#495057",
        },
        text: {
          light: "#212529",
          dark: "#f8f9fa",
        },
        'text-secondary': {
          light: "#6c757d",
          dark: "#adb5bd",
        },
        border: {
          light: "#dee2e6",
          dark: "#495057",
        },
        accent: {
          light: "#0d6efd",
          dark: "#0d6efd",
        },
      },
      backgroundColor: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        elevated: "#323A42", // Elevated components
      },
      textColor: {
        primary: "var(--color-text)",
        secondary: "var(--color-text-secondary)",
      },
      borderColor: {
        primary: "var(--color-border)",
      },
      ringColor: {
        accent: "var(--color-accent)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
      },
      borderRadius: {
        none: "0",
        sm: "0.125rem", // 2px
        DEFAULT: "0.25rem", // 4px
        md: "0.375rem", // 6px
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        full: "9999px",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      spacing: {
        0: "0",
        1: "0.25rem", // 4px
        2: "0.5rem", // 8px
        3: "0.75rem", // 12px
        4: "1rem", // 16px
        5: "1.25rem", // 20px
        6: "1.5rem", // 24px
        8: "2rem", // 32px
        10: "2.5rem", // 40px
        12: "3rem", // 48px
        16: "4rem", // 64px
        20: "5rem", // 80px
        24: "6rem", // 96px
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
