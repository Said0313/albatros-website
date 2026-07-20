import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-red": { DEFAULT: "#D0181F", dark: "#B5141B", bright: "#ED1C24" },
        "brand-blue": { DEFAULT: "#1D3A82", deep: "#1D3A82", mid: "#2E549C", light: "#5C7FB4" },
        "brand-teal": { DEFAULT: "#2E8AA0", bright: "#00C9B8" },
        // LIGHT THEME tokens
        bg: { page: "#FBFCFE", card: "#FFFFFF", elevated: "#F4F7FB", border: "#E5EAF3" },
        text: { primary: "#0C1B3A", secondary: "#5E6E8F", muted: "#8A98B5" },
      },
      fontFamily: {
        // Headings use Bounded in BOTH locales. Unlike the old Syne (Latin-only),
        // Bounded carries the full Cyrillic block plus the Uzbek modifier letters
        // ʻ/ʼ (verified with fontTools), so RU and UZ headings both render in real
        // Bounded with no missing-glyph squares. Inter stays the fallback.
        display: ["var(--font-bounded)", "var(--font-inter)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        // JetBrains Mono also lacks Cyrillic — fall to Inter so "mono" spots with
        // Cyrillic/Uzbek render cleanly instead of dropping to a system font.
        mono: ["var(--font-mono)", "var(--font-inter)", "monospace"],
      },
      maxWidth: { content: "1280px" },
      animation: {
        "fade-up": "fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
        "marquee-rev": "marquee-rev 35s linear infinite",
        "spin-slow": "spin 25s linear infinite",
        "pulse-ring": "pulseRing 3s ease-out infinite",
        bounceY: "bounceY 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: { from: { opacity: "0", transform: "translateY(28px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "marquee-rev": { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        pulseRing: { "0%": { transform: "scale(1)", opacity: "0.8" }, "100%": { transform: "scale(1.8)", opacity: "0" } },
        bounceY: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(8px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
