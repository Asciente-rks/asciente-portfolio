/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        // Editorial Terminal palette
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0a0e1a',
        },
        crt: {
          green: '#5eead4',
          amber: '#fbbf24',
          rose: '#f43f5e',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(94,234,212,0.18), 0 24px 80px rgba(0,0,0,0.55)',
        sharp: '0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.45)',
        cardLight: '0 1px 0 0 rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.06), 0 12px 30px rgba(15,23,42,0.06)',
      },
      backgroundImage: {
        'grid-dark':
          'radial-gradient(circle at top, rgba(94,234,212,0.06), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 60%)',
        'grid-light':
          'radial-gradient(circle at top, rgba(15,23,42,0.06), transparent 40%), linear-gradient(180deg, rgba(15,23,42,0.02), transparent 60%)',
        scanlines:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)',
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        pulseDot: 'pulseDot 2.4s ease-in-out infinite',
        fadeIn: 'fadeIn 0.6s ease-out both',
        slideUp: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        gridShift: 'gridShift 22s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.1%, 100%': { opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '0.45' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gridShift: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-40px, -40px, 0)' },
        },
      },
    },
  },
  plugins: [],
};
