import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        xs: "410px",
        sm: "600px",
      },
      colors: {
        "primary-color": "#FF4A4A",
        "secondary-color": "#f5f5f5",
        white: "#ffffff",
        "primary-black": "#1E1E1E",
        "primary-gray": "#1E1E1E99",
      },
    },
  },
  plugins: [require("rippleui")],
};
export default config;
