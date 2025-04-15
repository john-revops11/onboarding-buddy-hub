
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary-600)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: {
            DEFAULT: 'var(--primary-900)',
            '20': 'rgba(var(--primary-900), 0.2)'
          }
        },
        brand: {
          DEFAULT: '#5d842e',
          50: 'rgba(93, 132, 46, 0.05)',
          100: 'rgba(93, 132, 46, 0.1)',
          200: 'rgba(93, 132, 46, 0.2)',
          300: 'rgba(93, 132, 46, 0.3)',
          400: 'rgba(93, 132, 46, 0.4)',
          500: 'rgba(93, 132, 46, 0.5)',
          600: '#5d842e',
          700: 'rgba(93, 132, 46, 0.8)',
          800: 'rgba(93, 132, 46, 0.9)',
          900: 'rgba(93, 132, 46, 1)'
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          border: "hsl(var(--sidebar-border))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
