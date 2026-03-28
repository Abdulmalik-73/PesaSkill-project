/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        mpesa: {
          green: '#00A651',
          dark: '#007A3D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'mpesa': '0 4px 20px rgba(0,166,81,0.35)',
        'mpesa-lg': '0 8px 32px rgba(0,166,81,0.45)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'marquee': 'marquee 20s linear infinite',
      },
    },
  },
  plugins: [],
};
