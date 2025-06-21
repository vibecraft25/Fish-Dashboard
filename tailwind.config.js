/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#006994',
        'sea-green': '#0A7E8C',
        'coral': '#FF6B6B',
        'sand': '#F4E4C1',
      },
    },
  },
  plugins: [],
}