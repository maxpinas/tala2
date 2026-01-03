// Theme barrel export
// Importeer alles vanuit deze index file

// Theme colors and tokens
import { 
  colors, 
  lightTheme, 
  darkTheme,
  tileColorOptions,
  spacing, 
  borderRadius, 
  typography, 
  shadows 
} from './colors';

// Theme context and hooks
import ThemeContext, { ThemeProvider, useTheme, withTheme } from './ThemeContext';

// Export everything
export { 
  // Colors
  colors, 
  lightTheme, 
  darkTheme,
  tileColorOptions,
  
  // Shared tokens
  spacing, 
  borderRadius, 
  typography, 
  shadows,
  
  // Theme system
  ThemeContext,
  ThemeProvider,
  useTheme,
  withTheme,
};

// Legacy: theme object voor backwards compatibility
// DEPRECATED: Gebruik useTheme() hook in plaats van deze static import
export const theme = {
  ...colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
