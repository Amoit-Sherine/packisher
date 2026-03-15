import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:         "var(--bg)",
        accent:     "var(--accent)",
        "accent-2": "var(--accent-2)",
        "text-primary": "var(--text-primary)",
        "text-muted":   "var(--text-muted)",
        "glass-bg":     "var(--glass-bg)",
        "glass-border": "var(--glass-border)",
      },
      fontFamily: {
        barlow: ["var(--font-barlow)", "sans-serif"],
        inter:  ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      backdropBlur: {
        glass: "24px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
