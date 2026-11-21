/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#f1f3f5',
        muted: '#859099',
        borderDim: '#1f2428',
        borderMedium: '#2e3438',
        card: '#0a0d0e',
        accent: '#f1f3f5'
      },
      fontFamily: {
        grotesk: ['NewGrotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
      }
    },
  },
  plugins: [],
}

