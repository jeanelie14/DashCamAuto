export {colors, lightTheme, darkTheme} from './colors';
export {typography, textStyles} from './typography';
export {spacing, borderRadius, shadows, layout} from './spacing';

export type {Theme, ColorKey} from './colors';
export type {TextStyle} from './typography';
export type {SpacingKey, BorderRadiusKey, ShadowKey} from './spacing';

// Theme provider types
export interface ThemeContextType {
  theme: 'light' | 'dark' | 'auto';
  colors: typeof lightTheme.colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  layout: typeof layout;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}
