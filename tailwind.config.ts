
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2F855A", // Vert forêt
          foreground: "#FFFFFF",
          100: "#E6F4EA",
          200: "#C6E6D3",
          300: "#A3D8BC",
          400: "#81C9A3",
          500: "#2F855A",
          600: "#276749",
          700: "#1F4D37",
          800: "#173326",
          900: "#0F1A14"
        },
        secondary: {
          DEFAULT: "#EDF2F7", // Gris très clair
          foreground: "#1A202C",
        },
        destructive: {
          DEFAULT: "#E53E3E",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F7FAFC",
          foreground: "#4A5568",
        },
        accent: {
          DEFAULT: "#81E6D9", // Turquoise clair
          foreground: "#234E52",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A202C",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A202C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
