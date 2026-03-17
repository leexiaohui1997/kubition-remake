/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      },
      fontFamily: {
        // 等宽字体，优先使用 JetBrains Mono
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

