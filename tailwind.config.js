/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        invitation: {
          bg: '#f9f6f0',
          burgundy: '#801b26',
          gold: '#c5a059',
          dark: '#1a1519',
        },
      },
    },
  },
  plugins: [],
};
