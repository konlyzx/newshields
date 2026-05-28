import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0A',
          900: '#0A0A0A',
          800: '#111113',
          700: '#161618',
          600: '#1C1C20'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Anton', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'ui-serif', 'Georgia', 'serif']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px -8px rgba(0,0,0,0.6)',
        ring: '0 0 0 1px rgba(255,255,255,0.08)'
      },
      backgroundImage: {
        'mesh-radial':
          'radial-gradient(at 20% 0%, rgba(120, 80, 255, 0.18) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(30, 200, 255, 0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(255, 60, 120, 0.08) 0px, transparent 60%)',
        'noise':
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")"
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        'float': 'float 7s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite'
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: [forms, typography]
} satisfies Config;
