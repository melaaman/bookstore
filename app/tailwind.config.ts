import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          navy: '#0f172a',
          'navy-light': '#1e293b',
          amber: '#d97706',
          'amber-light': '#f59e0b',
          cream: '#faf7f2',
          'cream-dark': '#f0ebe2',
        },
      },
    },
  },
  plugins: [],
}

export default config
