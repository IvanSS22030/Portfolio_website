import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-20 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-500 
      ${theme === 'professional' 
        ? 'bg-gray-800 text-white hover:bg-gray-700' 
        : 'bg-amber-700 text-amber-200 hover:bg-amber-800 border border-amber-500'}`}
      aria-label={`Switch to ${theme === 'professional' ? 'personal' : 'professional'} theme`}
    >
      {theme === 'professional' ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;