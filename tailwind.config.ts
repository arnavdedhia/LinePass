import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#14213d", gold: "#fca311" },
      keyframes: {
        sweep: { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } }
      },
      animation: {
        sweep: "sweep 3.5s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
