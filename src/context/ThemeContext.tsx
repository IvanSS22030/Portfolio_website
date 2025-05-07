import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('professional');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'professional' ? 'personal' : 'professional');
  };

  // Apply theme class immediately on mount and when theme changes
  useEffect(() => {
    const applyTheme = () => {
      document.documentElement.classList.remove('theme-professional', 'theme-personal');
      document.documentElement.classList.add(`theme-${theme}`);
      
      const defaultTitle = document.querySelector('title[data-default]')?.textContent || 'Portfolio';
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