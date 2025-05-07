import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

// Constants
const THEME_STORAGE_KEY = 'portfolio-theme';
const DEFAULT_THEME: Theme = 'professional';
const DEFAULT_TITLE = 'Portfolio';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme || DEFAULT_THEME;
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'professional' ? 'personal' : 'professional';
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      return newTheme;
    });
  };

  // Apply theme class and update document title
  useEffect(() => {
    const applyTheme = () => {
      // Remove all theme classes
      document.documentElement.classList.remove('theme-professional', 'theme-personal');
      // Add current theme class
      document.documentElement.classList.add(`theme-${theme}`);
      
      // Update document title
      const defaultTitle = document.querySelector('title[data-default]')?.textContent || DEFAULT_TITLE;
      document.title = theme === 'professional' 
        ? `${defaultTitle} | Ivan Joel Sanchez Santana` 
        : `${defaultTitle} | The Castlevania Portfolio`;
    };

    // Apply theme immediately
    applyTheme();

    // Ensure theme is applied after any potential hydration
    requestAnimationFrame(applyTheme);
  }, [theme]);

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