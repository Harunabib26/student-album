/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C2541',
        'ink-light': '#2E3A5C',
        parchment: '#EDE6D6',
        'parchment-dark': '#E1D7BF',
        brass: '#C9A227',
        'brass-light': '#DDBE5C',
        maroon: '#7A2E2E',
        cream: '#F7F3E9',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        polaroid: '0 4px 10px rgba(28, 37, 65, 0.25)',
      },
    },
  },
  plugins: [],
}
