
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
        // Add explicit primary color definitions for dark mode
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
            '20': 'rgba(var(--primary-900), 0.2)' // Add opacity variant
          }
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
