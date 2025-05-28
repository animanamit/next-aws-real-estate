import type { Config } from "tailwindcss";
// import defaultConfig from "shadcn/ui/tailwind.config.js";

const config: Config = {
  // ...defaultConfig,
  content: [
    // ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // ...defaultConfig.theme,
    extend: {
      // ...defaultConfig.theme.extend,
      colors: {
        // ...defaultConfig.theme.extend.colors,
        // Pokemon Platinum inspired palette
        // Pokemon Platinum inspired palette
        "platinum-silver": "#E8E8E8",
        "warm-grey": "#A8A8A8",
        "charcoal-grey": "#4A4A4A",
        "muted-red": "#C85A5A",
        "coral-accent": "#E07A7A",
        "light-yellow": "#F5E6A3",
        "golden-accent": "#D4AF37",
        "pure-white": "#FFFFFF",
        "soft-black": "#2A2A2A",
        
        // Extended palette for richer UI
        "platinum-dark": "#D0D0D0",
        "platinum-light": "#F5F5F5",
        "steel-grey": "#8B8B8B",
        "shadow-grey": "#6B6B6B",
        "crimson-red": "#B84A4A",
        "rose-accent": "#F09A9A",
        "amber-yellow": "#E6D075",
        "cream-yellow": "#F9F3C7",
        "ash-grey": "#3A3A3A",
        "pearl-white": "#FDFDFD",
      },
      fontFamily: {
        neue: ["Neue Montreal", "system-ui", "sans-serif"],
        space: ["Space Grotesk", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
};

export default config;
