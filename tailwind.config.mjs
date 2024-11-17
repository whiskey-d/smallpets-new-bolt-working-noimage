/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F97316',
          light: '#FDBA74',
          dark: '#EA580C'
        },
        accent: {
          green: '#86efac',
          orange: '#F97316'
        }
      }
    }
  },
  plugins: []
};