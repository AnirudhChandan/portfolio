import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#020617",
        },
      },
      fontFamily: {
        // Inter for body text
        sans: ["var(--font-inter)", "sans-serif"],
        // Space Grotesk for headings and large metrics
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
