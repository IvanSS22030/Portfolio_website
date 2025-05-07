import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Navigation items configuration
const NAV_ITEMS = ['Home', 'About', 'Skills', 'Projects', 'Contact'] as const;

// Theme-specific styles
const styles = {
  professional: {
    nav: (scrolled: boolean) => `fixed top-0 left-0 w-full z-40 transition-all duration-300 
      ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`,
    link: 'text-gray-600 hover:text-blue-600',
    logo: 'text-gray-800',
  },
  personal: {
    nav: (scrolled: boolean) => `fixed top-0 left-0 w-full z-40 transition-all duration-300 
      ${scrolled ? 'bg-black bg-opacity-80 shadow-xl py-2' : 'bg-transparent py-4'}`,
    link: 'text-amber-300 hover:text-amber-500 font-serif',
    logo: 'text-amber-500 font-serif',
  },
};

const Header: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTheme = theme === 'professional' ? styles.professional : styles.personal;

  const renderNavLinks = (isMobile = false) => (
    <>
      {NAV_ITEMS.map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          onClick={() => isMobile && setIsOpen(false)}
          className={`${isMobile ? 'py-2' : ''} transition-colors duration-300 ${currentTheme.link}`}
        >
          {item}
        </a>
      ))}
      {theme === 'personal' && (
        <a
          href="#games"
          onClick={() => isMobile && setIsOpen(false)}
          className={`${isMobile ? 'py-2' : ''} transition-colors duration-300 ${currentTheme.link}`}
        >
          Games
        </a>
      )}
    </>
  );

  return (
    <header className={currentTheme.nav(scrolled)}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#home" 
          className={`text-2xl font-bold ${currentTheme.logo}`}
        >
          {theme === 'professional' ? (
            "Ivan Joel Sanchez"
          ) : (
            <span className="font-serif tracking-wider">Ivan Joel Sanchez</span>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {renderNavLinks()}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Menu"
        >
          {isOpen ? (
            <X className={currentTheme.logo} />
          ) : (
            <Menu className={currentTheme.logo} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`md:hidden w-full py-4 ${
          theme === 'professional' 
            ? 'bg-white' 
            : 'bg-black bg-opacity-90 border-t border-amber-900'
        }`}>
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {renderNavLinks(true)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;