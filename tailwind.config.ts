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
		screens: {
			sm: '0px', 
			md: '640px',
			lg: '1024px'
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				'body': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
				'mono-numeric': ['Roboto Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
					900: 'var(--primary-900)',
					foreground: 'hsl(var(--primary-foreground))'
				},
				'accent-green': {
					DEFAULT: 'var(--accent-green)',
					50: 'var(--accent-green-50)',
					100: 'var(--accent-green-100)',
					200: 'var(--accent-green-200)',
					300: 'var(--accent-green-300)',
					400: 'var(--accent-green-400)',
					500: 'var(--accent-green-500)',
					600: 'var(--accent-green-600)',
					700: 'var(--accent-green-700)',
					800: 'var(--accent-green-800)',
					900: 'var(--accent-green-900)',
				},
				neutral: {
					200: 'var(--neutral-200)',
					300: 'var(--neutral-300)',
					400: 'var(--neutral-400)',
					500: 'var(--neutral-500)',
					600: 'var(--neutral-600)',
					700: 'var(--neutral-700)',
					800: 'var(--neutral-800)',
					900: 'var(--neutral-900)',
				},
				error: {
					DEFAULT: 'var(--error)',
					50: 'var(--error-50)',
					100: 'var(--error-100)',
					200: 'var(--error-200)',
					300: 'var(--error-300)',
					400: 'var(--error-400)',
					500: 'var(--error-500)',
					600: 'var(--error-600)',
					700: 'var(--error-700)',
					800: 'var(--error-800)',
					900: 'var(--error-900)',
				},
				warning: {
					DEFAULT: 'var(--warning)',
					50: 'var(--warning-50)',
					100: 'var(--warning-100)',
					200: 'var(--warning-200)',
					300: 'var(--warning-300)',
					400: 'var(--warning-400)',
					500: 'var(--warning-500)',
					600: 'var(--warning-600)',
					700: 'var(--warning-700)',
					800: 'var(--warning-800)',
					900: 'var(--warning-900)',
				},
				success: {
					DEFAULT: 'var(--success)',
					50: 'var(--success-50)',
					100: 'var(--success-100)',
					200: 'var(--success-200)',
					300: 'var(--success-300)',
					400: 'var(--success-400)',
					500: 'var(--success-500)',
					600: 'var(--success-600)',
					700: 'var(--success-700)',
					800: 'var(--success-800)',
					900: 'var(--success-900)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Define green-base for compatibility with existing codebase
				'green-base': 'var(--accent-green)',
				'green-hover': 'var(--accent-green-600)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				},
				pulse: {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '.5',
					},
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
