import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060b14',
        foreground: '#f8fafc',
        card: '#0f172a',
        border: '#1e293b',
        muted: '#94a3b8',
        primary: '#38bdf8',
        accent: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b'
      },
      boxShadow: {
        glow: '0 0 48px rgba(56, 189, 248, 0.14)'
      }
    }
  },
  plugins: [animate]
};
