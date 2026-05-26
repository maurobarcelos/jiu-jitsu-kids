/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Comic Sans MS", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
      colors: {
        ink: "#1F1F1F",
        cream: "#FFF8E7",
        sunshine: "#FFD93D",
        tangerine: "#FF8C42",
        leaf: "#58CC02",
        leafDark: "#2C8A02",
        sky: "#1CB0F6",
        cherry: "#FF4B4B",
        grape: "#CE82FF",
      },
      boxShadow: {
        chunky: "0 6px 0 #1F1F1F",
        "chunky-sm": "0 4px 0 #1F1F1F",
        "chunky-green": "0 6px 0 #2C8A02",
        "chunky-red": "0 6px 0 #B71C1C",
      },
      animation: {
        "bounce-slow": "bounce 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "star-pop": "starPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        starPop: {
          "0%": { transform: "scale(0.5)" },
          "50%": { transform: "scale(1.4)" },
          "100%": { transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px) scale(0.8)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
