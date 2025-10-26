import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#10B981",
          "primary-content": "#FFFFFF",
          secondary: "#059669",
          "secondary-content": "#FFFFFF",
          accent: "#34D399",
          "accent-content": "#000000",
          neutral: "#1F2937",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F3F4F6",
          "base-300": "#E5E7EB",
          "base-content": "#000000",
          info: "#3ABFF8",
          success: "#10B981",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
      {
        dark: {
          primary: "#10B981",
          "primary-content": "#000000",
          secondary: "#059669",
          "secondary-content": "#FFFFFF",
          accent: "#34D399",
          "accent-content": "#000000",
          neutral: "#F3F4F6",
          "neutral-content": "#000000",
          "base-100": "#000000",
          "base-200": "#1F2937",
          "base-300": "#374151",
          "base-content": "#FFFFFF",
          info: "#3ABFF8",
          success: "#10B981",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};

export default config;
