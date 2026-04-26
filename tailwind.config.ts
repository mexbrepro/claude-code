import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Restrained earth-tone palette + one signal color.
        ground: {
          50: "#faf8f5",
          100: "#f1ece4",
          200: "#e3dacc",
          300: "#cfc0a9",
          400: "#b09a78",
          500: "#8b7858",
          600: "#6c5d44",
          700: "#524735",
          800: "#3a3226",
          900: "#26211a",
        },
        ink: {
          DEFAULT: "#1f1c17",
          soft: "#3a342c",
          muted: "#6b6357",
        },
        signal: {
          // Surfaces only at moments of pattern recognition / migration.
          DEFAULT: "#a8623a",
          soft: "#c98968",
        },
      },
      fontFamily: {
        // Humanist serif for the user's own words.
        serif: ["'Source Serif 4'", "'Source Serif Pro'", "Georgia", "serif"],
        // Geometric sans for UI chrome.
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        slow: "500ms",
      },
      keyframes: {
        breath: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breath: "breath 3.6s ease-in-out infinite",
        rise: "rise 500ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
