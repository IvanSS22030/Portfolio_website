import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ScrollToTop: React.FC = () => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all duration-500 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      ${theme === 'professional'
        ? 'bg-blue-600 hover:bg-blue-700 text-white'
        : 'bg-amber-800 hover:bg-amber-900 text-amber-200 border border-amber-500'}`}
      aria-label="Scroll to top"
    >
      {theme === 'professional' ? (
        <ArrowUp className="w-5 h-5" />
      ) : (
        <div className="flex items-center justify-center w-5 h-5">
          <ArrowUp className="w-5 h-5" />
        </div>
      )}
    </button>
  );
};

export default ScrollToTop;