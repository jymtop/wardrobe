/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8B4B8',
        'primary-dark': '#D4949A',
        secondary: '#A28089',
        accent: '#EED6D3',
        background: '#FDF6F0',
        'background-dark': '#F5EDE5',
        wood: '#C9A66B',
        'wood-dark': '#8B6914',
        'wood-light': '#E8D5B0',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'door-open-left': 'doorOpenLeft 0.6s ease-out forwards',
        'door-open-right': 'doorOpenRight 0.6s ease-out forwards',
        'door-close-left': 'doorCloseLeft 0.6s ease-out forwards',
        'door-close-right': 'doorCloseRight 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'drawer-open': 'drawerOpen 0.3s ease-in-out forwards',
        'drawer-close': 'drawerClose 0.3s ease-in-out forwards',
      },
      keyframes: {
        doorOpenLeft: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(-105deg)' },
        },
        doorOpenRight: {
          '0%': { transform: 'perspective(1200px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(105deg)' },
        },
        doorCloseLeft: {
          '0%': { transform: 'perspective(1200px) rotateY(-105deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(0deg)' },
        },
        doorCloseRight: {
          '0%': { transform: 'perspective(1200px) rotateY(105deg)' },
          '100%': { transform: 'perspective(1200px) rotateY(0deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerOpen: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        drawerClose: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'wardrobe': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
