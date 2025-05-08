import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, THEME_STORAGE_KEY, DEFAULT_THEME, isTheme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  // Initialize theme with proper type checking
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      
      // Use initialTheme prop if provided and valid
      if (initialTheme && isTheme(initialTheme)) {
        return initialTheme;
      }
      
      // Check saved theme
      if (savedTheme) {
        if (isTheme(savedTheme)) {
          return savedTheme;
        }
        // Invalid saved theme, remove it
        localStorage.removeItem(THEME_STORAGE_KEY);
      }
      
      return DEFAULT_THEME;
    } catch (error) {
      console.warn('Error reading theme from localStorage:', error);
      return DEFAULT_THEME;
    }
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'professional' ? 'personal' : 'professional';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.warn('Error saving theme to localStorage:', error);
      }
      return newTheme;
    });
  };

  // Apply theme class and update document title
  useEffect(() => {
    const applyTheme = () => {
      try {
        // Remove all theme classes
        document.documentElement.classList.remove('theme-professional', 'theme-personal');
        // Add current theme class
        document.documentElement.classList.add(`theme-${theme}`);
        
        // Update document title
        const defaultTitle = document.querySelector('title[data-default]')?.textContent;
        if (!defaultTitle) {
          console.warn('Default title element not found');
        }
        
        document.title = theme === 'professional' 
          ? `${defaultTitle || 'Portfolio'} | Ivan Joel Sanchez Santana` 
          : `${defaultTitle || 'Portfolio'} | The Castlevania Portfolio`;
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    };

    // Apply theme immediately
    applyTheme();

    // Ensure theme is applied after any potential hydration
    const timeoutId = setTimeout(applyTheme, 0);
    return () => clearTimeout(timeoutId);
  }, [theme]);

  // Media query listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update theme if user hasn't explicitly set one
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(e.matches ? 'personal' : 'professional');
      }
    };

    try {
      // Modern browsers
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } catch (err1) {
      try {
        // Older browsers
        mediaQuery.addListener(handleSystemThemeChange);
      } catch (err2) {
        console.warn('Could not add system theme listener:', err2);
      }
    }

    return () => {
      try {
        // Modern browsers
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } catch (err1) {
        try {
          // Older browsers
          mediaQuery.removeListener(handleSystemThemeChange);
        } catch (err2) {
          console.warn('Could not remove system theme listener:', err2);
        }
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};