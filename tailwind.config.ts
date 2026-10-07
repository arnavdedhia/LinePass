import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#14213d", gold: "#fca311" }
    }
  },
  plugins: []
};

export default config;
