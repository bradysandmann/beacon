/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          0: "#000000",
          50: "#070708",
          100: "#0B0B0E",
          200: "#111114",
          300: "#16161A",
          400: "#1C1C22",
        },
        glow: {
          violet: "#A78BFA",
          cyan: "#67E8F9",
          magenta: "#F472B6",
        },
        line: "rgba(255,255,255,0.10)",
        lineStrong: "rgba(255,255,255,0.18)",
        muted: "#A1A1AA",
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter Display"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', '"JetBrains Mono"', '"SF Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter2: "-0.035em",
      },
      animation: {
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        scan: "scan 2.6s linear infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
