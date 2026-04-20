import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f1117",
        surface: "#181b24",
        "surface-2": "#13151d",
        border: "#232634",
        "border-2": "#2a2e3d",
        text: "#e8e8ea",
        muted: "#8a8f9c",
        positive: "#4ade80",
        negative: "#f87171",
        chart: {
          blue:   "#60a5fa",
          purple: "#a78bfa",
          amber:  "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
