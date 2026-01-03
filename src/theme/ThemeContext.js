import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, spacing, borderRadius, typography, shadows } from './colors';

// Storage key voor theme persistentie
const THEME_STORAGE_KEY = '@tala_theme_mode';

// ThemeContext type definition
const ThemeContext = createContext(null);

/**
 * ThemeProvider
 * 
 * Wrapper component die het theme systeem beschikbaar maakt voor de hele app.
 * Beheert light/dark mode switching en persisteert de keuze.
 * 
 * Gebruik: Wrap je hele app in <ThemeProvider>
 */
export const ThemeProvider = ({ children }) => {
  // State: 'light' of 'dark'
  const [themeMode, setThemeMode] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTheme();
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [themeMode]);

  // Set specific theme
  const setTheme = useCallback(async (mode) => {
    if (mode !== 'light' && mode !== 'dark') {
      console.warn('Invalid theme mode:', mode);
      return;
    }
    
    setThemeMode(mode);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // Get current theme colors
  const colors = useMemo(() => {
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode]);

  // Complete theme object met alle tokens
  const theme = useMemo(() => ({
    // Alle kleuren van het huidige theme
    ...colors,
    
    // Shared tokens (altijd hetzelfde)
    spacing,
    borderRadius,
    typography,
    shadows,
  }), [colors]);

  // Context value
  const value = useMemo(() => ({
    // Theme mode
    themeMode,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
    
    // Theme switching functions
    toggleTheme,
    setTheme,
    
    // Complete theme object
    theme,
    
    // Direct access to colors (convenience)
    colors,
    
    // Shared tokens (convenience)
    spacing,
    borderRadius,
    typography,
    shadows,
    
    // Loading state
    isLoading,
  }), [themeMode, toggleTheme, setTheme, theme, colors, isLoading]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme Hook
 * 
 * Hook om toegang te krijgen tot het theme systeem.
 * 
 * Gebruik:
 * const { theme, isDark, toggleTheme } = useTheme();
 * 
 * // In styles:
 * backgroundColor: theme.bg,
 * color: theme.text,
 * 
 * // Toggle:
 * <Button onPress={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'} />
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * withTheme HOC
 * 
 * Higher-order component voor class components of externe libraries.
 * 
 * Gebruik:
 * export default withTheme(MyComponent);
 * 
 * In MyComponent:
 * const { theme } = this.props;
 */
export const withTheme = (WrappedComponent) => {
  const ThemedComponent = (props) => {
    const themeContext = useTheme();
    return <WrappedComponent {...props} {...themeContext} />;
  };
  
  ThemedComponent.displayName = `withTheme(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return ThemedComponent;
};

export default ThemeContext;
