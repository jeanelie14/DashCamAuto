import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import {
  lightTheme,
  darkTheme,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  ThemeContextType,
} from '../theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'auto';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children, initialTheme = 'auto'}) => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>(initialTheme);
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>('light');

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setSystemTheme(colorScheme || 'light');
    });

    // Get initial system theme
    setSystemTheme(Appearance.getColorScheme() || 'light');

    return () => subscription?.remove();
  }, []);

  // Determine the actual theme to use
  const actualTheme = theme === 'auto' ? systemTheme || 'light' : theme;
  const colors = actualTheme === 'dark' ? darkTheme.colors : lightTheme.colors;

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'auto';
      return 'light';
    });
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    layout,
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme-aware styles
export const useThemedStyles = <T extends Record<string, any>>(
  createStyles: (theme: ThemeContextType) => T,
): T => {
  const theme = useTheme();
  return createStyles(theme);
};
