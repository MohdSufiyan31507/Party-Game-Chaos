import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        void: "rgb(var(--color-void) / <alpha-value>)",
        plasma: "rgb(var(--color-plasma) / <alpha-value>)",
        surge: "rgb(var(--color-surge) / <alpha-value>)",
        punch: "rgb(var(--color-punch) / <alpha-value>)",
        flare: "rgb(var(--color-flare) / <alpha-value>)",
        lime: "rgb(var(--color-lime) / <alpha-value>)",
      },
      boxShadow: {
        glow: "0 0 34px rgb(var(--color-surge) / 0.28)",
        hot: "0 0 34px rgb(var(--color-punch) / 0.24)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgb(var(--color-grid) / 0.08) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-grid) / 0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
