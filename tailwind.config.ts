import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        neon: {
          purple: "#A855F7",
          pink: "#EC4899",
          blue: "#3B82F6",
          green: "#10B981",
          cyan: "#06B6D4",
        },
        dark: {
          DEFAULT: "#0F0A1E",
          100: "#1A1033",
          200: "#241847",
          300: "#2D1F5A",
          400: "#3B2578",
          card: "#160D2E",
          nav: "#0D0820",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0F0A1E 0%, #1A0533 50%, #0F0A1E 100%)",
        "card-gradient":
          "linear-gradient(145deg, rgba(124, 58, 237, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
        "neon-gradient":
          "linear-gradient(90deg, #7C3AED, #A855F7, #EC4899)",
      },
      boxShadow: {
        "neon-purple": "0 0 20px rgba(168, 85, 247, 0.5)",
        "neon-pink": "0 0 20px rgba(236, 72, 153, 0.5)",
        "card-hover": "0 8px 32px rgba(124, 58, 237, 0.3)",
        glow: "0 0 40px rgba(168, 85, 247, 0.2)",
      },
      fontFamily: {
        sans: ["Prompt", "Noto Sans Thai", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "countdown": "countdown 1s linear infinite",
        "shimmer": "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(168, 85, 247, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
