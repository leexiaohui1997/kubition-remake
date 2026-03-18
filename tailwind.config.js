/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // MUD 主题背景色
        'mud-bg': '#0a0a0a',
        'mud-bg-secondary': '#111111',
        'mud-bg-tertiary': '#1a1a1a',
        // MUD 主题文字色
        'mud-text': '#c8c8c8',
        'mud-text-dim': '#666666',
        // MUD 主题强调色
        'mud-accent': '#d4a017',
        // MUD 主题状态色
        'mud-success': '#4caf50',
        'mud-warning': '#ff9800',
        'mud-info': '#2196f3',
        'mud-danger': '#f44336',
      },
      fontFamily: {
        // 等宽字体，优先使用 JetBrains Mono
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      keyframes: {
        'log-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'log-in': 'log-in 0.2s ease-out both',
        'fade-in': 'fade-in 0.15s ease-out both',
        'slide-up': 'slide-up 0.2s ease-out both',
      },
    },
  },
  plugins: [],
}
