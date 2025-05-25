import { lightTheme } from './light';
import { darkTheme } from './dark';

// Define a base theme type that both light and dark themes must follow
export type BaseTheme = {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  spacing: {
    sidebar: {
      width: string;
      widthCollapsed: string;
    };
    header: {
      height: string;
    };
  };
  borderRadius: {
    default: string;
    sm: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    default: string;
    md: string;
    lg: string;
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
};

export type Theme = BaseTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// Utility function to get a theme value
export function getThemeValue(theme: Theme, path: string) {
  return path.split('.').reduce((obj, key) => obj[key], theme as any);
}

// Utility function to generate CSS variables from a theme
export function generateThemeVariables(theme: Theme) {
  const variables: Record<string, string> = {};

  function traverse(obj: any, prefix = '') {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string') {
        variables[`--${prefix}${key}`] = value;
      } else if (typeof value === 'object') {
        traverse(value, `${prefix}${key}-`);
      }
    }
  }

  traverse(theme);
  return variables;
}

// Export theme types
export type { LightTheme } from './light';
export type { DarkTheme } from './dark'; 