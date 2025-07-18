module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a7f3d0',
          DEFAULT: '#22c55e',
          dark: '#166534',
        },
        secondary: '#bbf7d0',
        accent: '#4ade80',
      },
    },
  },
  plugins: [],
};
