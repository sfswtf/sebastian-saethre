import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{md,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        bg: "#0b0c0f",
        surface: "#111317", 
        text: "#e6e8eb",
        muted: "#9aa3af",
        accent: "#7c9cff",
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.08)",
        elevated: "0 12px 40px rgba(0,0,0,0.16)",
      },
      maxWidth: {
        container: "80rem",
      },
      spacing: {
        'container-x': '1rem',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
