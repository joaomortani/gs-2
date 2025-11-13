/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6CDF',
          dark: '#1B4FB8',
          light: '#6FA2FF',
        },
        secondary: {
          DEFAULT: '#8458FF',
          dark: '#6E3FFF',
          light: '#CAB7FF',
        },
        text: {
          primary: '#323F4B',
          secondary: '#9AA5B1',
          strong: '#0F1419',
        },
        background: {
          DEFAULT: '#F5F7FA',
          white: '#FFFFFF',
        },
        border: '#E4E7EB',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        overlay: 'rgba(15, 20, 25, 0.5)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

