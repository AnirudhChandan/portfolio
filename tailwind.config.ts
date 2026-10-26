import type { Config } from "tailwindcss";

// Colours come from CSS variables (globals.css) so one data-theme switch on <html>
// re-skins every page, including the blog and Lab, without per-component dark: classes.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name: string, steps: number[]) =>
  Object.fromEntries(steps.map((s) => [s, v(`${name}-${s}`)]));
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: scale("slate", STEPS),
        teal: scale("teal", STEPS),
        gold: scale("gold", [300, 400, 500]),
        white: v("white"),
        black: v("black"),
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
