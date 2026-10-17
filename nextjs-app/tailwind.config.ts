import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: "#C8877A",
        "rose-lt": "#E8B4AC",
        blush: "#F5E8E6",
        plum: "#2A1525",
        "plum-mid": "#4A2040",
        lavender: "#C4A8D4",
        "lav-lt": "#EDE4F5",
        cream: "#FEFAF8",
        "warm-gray": "#8A7A82",
        gold: "#B8906A",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.8" },
          "33%": { transform: "translate(20px, -30px) scale(1.06)", opacity: "1" },
          "66%": { transform: "translate(-15px, 15px) scale(0.96)", opacity: "0.7" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        symbolGlowPulse: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        ringFloat: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-14px) scale(1.01)" },
        },
        dotBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        scrollPulse: {
          "0%, 100%": { opacity: "1", transform: "scaleY(1)" },
          "50%": { opacity: "0.4", transform: "scaleY(0.6)" },
        },
        gapPulse: {
          "0%, 100%": { borderColor: "rgba(255,100,100,0.3)" },
          "50%": { borderColor: "rgba(255,100,100,0.8)", transform: "scale(1.3)" },
        },
        connTravel: {
          "0%": { left: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        drawHB: {
          "0%": { strokeDashoffset: "400" },
          "100%": { strokeDashoffset: "0" },
        },
        artworkReveal: {
          "0%": { opacity: "0", transform: "translateY(-48%) scale(0.97)", filter: "blur(15px)" },
          "100%": { opacity: "1", transform: "translateY(-50%) scale(1)", filter: "blur(0px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        glowDrift: "glowDrift 14s ease-in-out infinite",
        glowPulse: "glowPulse 5s ease-in-out infinite",
        symbolGlowPulse: "symbolGlowPulse 6s ease-in-out infinite",
        ringFloat: "ringFloat 8s ease-in-out infinite",
        dotBlink: "dotBlink 2s ease-in-out infinite",
        scrollPulse: "scrollPulse 2s ease-in-out infinite",
        gapPulse: "gapPulse 2s ease-in-out infinite",
        connTravel: "connTravel 2.5s ease-in-out infinite",
        drawHB: "drawHB 2s ease forwards 0.5s",
        artworkReveal: "artworkReveal 2.2s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
