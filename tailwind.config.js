/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'evolivie-mint': '#3AB795',
        'evolivie-coral': '#FF6B6B',
        'evolivie-mint-light': '#4ECDC4',
        'evolivie-mint-dark': '#2A9D8F',
        'evolivie-coral-light': '#FF8E8E',
        'evolivie-coral-dark': '#E55555',
        'evolivie-gray': {
          50: '#F8FFFE',
          100: '#F1F5F4',
          900: '#1A1A1A'
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-evolivie': 'pulse-evolivie 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-evolivie': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(58, 183, 149, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(58, 183, 149, 0)' }
        }
      }
    },
  },
  plugins: [],
};