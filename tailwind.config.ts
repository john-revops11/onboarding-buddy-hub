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
					50: '#F3F7FC',
					100: '#E9F0F8',
					200: '#C5D7EB',
					300: '#9BBCDE',
					400: '#5A8DC2',
					500: '#2E67A5',
					600: '#12366B',
					700: '#0B2B50',
					800: '#081F3A',
					900: '#051425',
					foreground: 'hsl(var(--primary-foreground))'
				},
				accentGreen: {
					100: '#f0f7eb',
					200: '#e0efd6',
					300: '#c2dfae',
					400: '#a3cf86',
					500: '#85bf5e',
					600: '#67af44',
					700: '#528c36',
					800: '#3e6a29',
					900: '#2a471c',
				},
				neutral: {
					200: '#E5EAF1',
					300: '#D3DAE5',
					400: '#A4AFBF',
					500: '#8797AC',
					600: '#56637A',
					700: '#3F4859',
					800: '#293141',
					900: '#1C2431',
				},
				error: {
					100: '#FDEBEB',
					200: '#FAD6D6',
					300: '#F5ACAD',
					400: '#F08384',
					500: '#EA595A',
					600: '#E05858',
					700: '#C73E3F',
					800: '#A32A2A',
					900: '#7A2021',
				},
				warning: {
					100: '#FFF5E6',
					200: '#FEEACC',
					300: '#FDD599',
					400: '#FCC066',
					500: '#FAAB33',
					600: '#F5A623',
					700: '#D88A0C',
					800: '#AD6D0A',
					900: '#825105',
				},
				success: {
					DEFAULT: 'var(--accent)',
					foreground: 'var(--accent-foreground)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
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
				'green-base': '#67af44',
				'green-hover': '#528c36',
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
