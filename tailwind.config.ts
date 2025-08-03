// tailwind.config.js
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // Your custom gradient colors
        peach: '#fff1eb',
        'sky-blue': '#ace0f9',
        'gradient-1': '#eaecee',
        'gradient-2': '#d5e8f2',
        'gradient-3': '#c0e4f5',

        // Complementary colors
        'complement-peach': '#eaf8ff',
        'complement-blue': '#f9c4ab',

        // Accent colors
        'mint-fresh': '#eafff0',
        'lavender-mist': '#f0eaff',

        // Shadcn theme integration
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        }
        // ... additional shadcn colors
      },
      backgroundImage: {
        'auth-gradient': 'linear-gradient(to bottom right, #fff1eb, #ace0f9)',
        'reverse-gradient': 'linear-gradient(to bottom right, #ace0f9, #fff1eb)'
      }
    }
  }
};
