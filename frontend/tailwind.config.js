import stitchConfig from './stitch_screens/tailwind_config.json';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...stitchConfig.theme.extend.colors,
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: stitchConfig.theme.extend.borderRadius,
      spacing: stitchConfig.theme.extend.spacing,
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        code: ['"JetBrains Mono"', 'monospace'],
        ...stitchConfig.theme.extend.fontFamily,
      },
      fontSize: stitchConfig.theme.extend.fontSize,
    },
  },
  plugins: [],
};
