/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1437',
          900: '#060B22',
          800: '#0B1437',
          700: '#152052',
          600: '#1E2C6E',
          500: '#2A3A82',
          300: '#7A86AE',
          200: '#AEB6D0',
        },
        indigo: {
          50: '#EEF0FC',
          100: '#DFE3FA',
          200: '#C3CAF5',
          300: '#9AA5EC',
          400: '#6E7DE0',
          500: '#4F5FD6',
          600: '#4338CA',
          700: '#3A31AC',
          800: '#2F2A8A',
          900: '#26236E',
        },
        ink: {
          DEFAULT: '#0B1437',
          muted: '#5B6689',
          soft: '#8A93AF',
        },
        line: {
          DEFAULT: '#E3E6F0',
          soft: '#EEF0F6',
          strong: '#CFD5E5',
        },
        canvas: {
          DEFAULT: '#F6F7FC',
          alt: '#FFFFFF',
        },
        gold: '#F59E0B',
        grass: '#0E9F6E',
        coral: '#E4572E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      maxWidth: {
        shell: '1200px',
        wide: '1320px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,20,55,0.04), 0 1px 3px rgba(11,20,55,0.06)',
        lift: '0 4px 16px rgba(11,20,55,0.08)',
        pop: '0 12px 40px rgba(11,20,55,0.14)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-dot': {
          '0%, 60%, 100%': { opacity: '0.25', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-3px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .45s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .35s ease both',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
}
