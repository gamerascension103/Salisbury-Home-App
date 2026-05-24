import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1424",
        "ink-soft": "#3a2f4a",
        "ink-mute": "#6b6378",
        bg: "#ebe8f0",
        "bg-card": "#f6f4f9",
        accent: "#5b3a8f",
        "accent-deep": "#3d2466",
        "accent-soft": "#d8cce8",
        highlight: "#9b7fc7",
        silver: "#8a8599",
        "silver-bright": "#b8b3c4",
        "silver-shimmer": "#d4d0dc",
        rule: "#c9c2d4",
      },
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        "inter-tight": ["Inter Tight", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        display: ["clamp(48px, 7vw, 76px)", { lineHeight: "1.05" }],
        h2: ["32px", { lineHeight: "1.2" }],
        h3: ["22px", { lineHeight: "1.3" }],
        lead: ["19px", { lineHeight: "1.6" }],
        body: ["15px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        caption: ["13px", { lineHeight: "1.5" }],
        label: ["11px", { lineHeight: "1" }],
        "label-xs": ["10px", { lineHeight: "1" }],
      },
      maxWidth: {
        document: "880px",
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
