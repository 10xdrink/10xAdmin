/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  
  darkMode: 'class', // or 'media' or false
  theme: {
    extend: {
      colors: {
        // 10X Brand Colors
        'deep-navy': '#282143',
        'primary-blue': '#061aab',
        'secondary-blue': '#0821d2',
        'black': '#000000',
        'white': '#FFFFFF',
        'light-grey': '#EBEBEB',
        'sunglow': '#FFD255',
        'lawn-green': '#B2EE17',
        'cyan': '#13EAED',
        'purple': '#5A47FF',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'quantico': ['Quantico', 'sans-serif'],
        'nimbus': ['Nimbus Sans', 'sans-serif'],
        'pt-sans': ['PT Sans', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressBar: {
          '0%': { width: '0%' },
          '50%': { width: '100%' },
          '100%': { width: '0%' }
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'progress': 'progressBar 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 1s infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #000000 0%, #0821d2 100%)',
        'gradient-secondary': 'linear-gradient(360deg, #000000 0%, #0821d2 100%)',
        'gradient-light': 'linear-gradient(180deg, #ffffff 0%, #e6e6e6 100%)',
        'power-up': 'linear-gradient(to bottom, #FFD255, #B2EE17)',
        'power-down': 'linear-gradient(to bottom, #13EAED, #5A47FF)',
      },
    },
  },
  plugins: [],
};
