import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A90B8",
          50: "#EBF4F8",
          100: "#D7E9F1",
          200: "#AFD3E3",
          300: "#87BDD5",
          400: "#5FA7C7",
          500: "#4A90B8",
          600: "#3A7293",
          700: "#2B556E",
          800: "#1D3849",
          900: "#0E1C25"
        },
        accent: {
          DEFAULT: "#F5A623",
          50: "#FEF6E7",
          100: "#FDEDD0",
          200: "#FBDBA1",
          300: "#F9C972",
          400: "#F7B743",
          500: "#F5A623",
          600: "#D08609",
          700: "#9C6407",
          800: "#684305",
          900: "#342102"
        },
        success: {
          DEFAULT: "#7CB342",
          500: "#7CB342"
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        border: "hsl(var(--border))"
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" }
        },
        "count-up": {
          from: { opacity: "0", transform: "scale(0.5)" },
          to: { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "count-up": "count-up 0.5s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
