import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070817",
        void: "#10132B",
        plasma: "#B637FF",
        surge: "#20D9FF",
        punch: "#FF3F8F",
        flare: "#FF9D2E",
        lime: "#4DFF91",
      },
      boxShadow: {
        glow: "0 0 34px rgba(32, 217, 255, 0.28)",
        hot: "0 0 34px rgba(255, 63, 143, 0.24)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
