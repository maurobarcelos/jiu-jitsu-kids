/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fredoka", "system-ui", "sans-serif"],
        body: ["Nunito", "system-ui", "sans-serif"],
      },
      colors: {
        // Paleta Brilliant-inspired
        ink: "#0F0F0F",
        muted: "#6B7280",
        bg: "#FFFFFF",
        surface: "#FAFAFA",
        border: "#E5E7EB",
        // Acentos vibrantes
        leaf: "#22C55E",      // verde Brilliant
        leafSoft: "#DCFCE7",
        tangerine: "#FB923C",  // laranja dos pedestais
        sunshine: "#FACC15",
        sky: "#3B82F6",
        cherry: "#EF4444",
        grape: "#A855F7",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
        lift: "0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
        glow: "0 0 40px rgba(34,197,94,0.25)",
      },
      animation: {
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "star-pop": "starPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fadeIn 0.4s ease-out",
        "spotlight": "spotlight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "ray": "ray 2s ease-in-out infinite",
      },
      keyframes: {
        starPop: {
          "0%": { transform: "scale(0.5)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(40px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        spotlight: {
          "0%": { transform: "scale(0.3) translateY(20px)", opacity: "0" },
          "60%": { transform: "scale(1.1) translateY(0)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        ray: {
          "0%, 100%": { opacity: "0.4", transform: "scaleY(0.9)" },
          "50%": { opacity: "0.9", transform: "scaleY(1.1)" },
        },
      },
    },
  },
  plugins: [],
};
