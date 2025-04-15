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
          50: 'rgba(93, 132, 46, 0.1)',
          100: 'rgba(93, 132, 46, 0.2)',
          200: 'rgba(93, 132, 46, 0.3)',
          300: 'rgba(93, 132, 46, 0.4)',
          400: 'rgba(93, 132, 46, 0.5)',
          500: 'rgba(93, 132, 46, 0.6)',
          600: '#5d842e',
          700: 'rgba(93, 132, 46, 0.8)',
          800: 'rgba(93, 132, 46, 0.9)',
          900: 'rgba(93, 132, 46, 1)'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
} satisfies Config;
