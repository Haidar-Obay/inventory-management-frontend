export const darkTheme = {
  colors: {
    background: 'hsl(224 71% 4%)',
    foreground: 'hsl(0 0% 100%)',
    primary: 'hsl(226 71% 40%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(217 91% 67%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(223 47% 11%)',
    mutedForeground: 'hsl(215 20% 65%)',
    accent: 'hsl(223 47% 11%)',
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(350 89% 60%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(240 3.7% 15.9%)',
    input: 'hsl(240 3.7% 15.9%)',
    ring: 'hsl(246 84% 59%)',
  },
  spacing: {
    sidebar: {
      width: '280px',
      widthCollapsed: '80px',
    },
    header: {
      height: '64px',
    },
  },
  borderRadius: {
    default: '0.5rem',
    sm: '0.25rem',
    lg: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
} as const;

export type DarkTheme = typeof darkTheme; 