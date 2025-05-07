import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const professionalNav = `fixed top-0 left-0 w-full z-40 transition-all duration-300 
    ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`;

  const personalNav = `fixed top-0 left-0 w-full z-40 transition-all duration-300 
    ${scrolled ? 'bg-black bg-opacity-80 shadow-xl py-2' : 'bg-transparent py-4'}`;

  return (
    <header className={theme === 'professional' ? professionalNav : personalNav}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a 
          href="#home" 
          className={`text-2xl font-bold ${theme === 'professional' 
            ? 'text-gray-800' 
            : 'text-amber-500 font-serif'}`}
        >
          {theme === 'professional' ? (
            "Ivan Joel Sanchez"
          ) : (
            <span className="font-serif tracking-wider">Ivan Joel Sanchez</span>
          )}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`transition-colors duration-300 ${
                theme === 'professional'
                  ? 'text-gray-600 hover:text-blue-600'
                  : 'text-amber-300 hover:text-amber-500 font-serif'
              }`}
            >
              {item}
            </a>
          ))}
          {theme === 'personal' && (
            <a
              href="#games"
              className="text-amber-300 hover:text-amber-500 transition-colors duration-300 font-serif"
            >
              Games
            </a>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Menu"
        >
          {isOpen ? (
            <X className={theme === 'professional' ? 'text-gray-800' : 'text-amber-500'} />
          ) : (
            <Menu className={theme === 'professional' ? 'text-gray-800' : 'text-amber-500'} />
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
            {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className={`py-2 transition-colors duration-300 ${
                  theme === 'professional'
                    ? 'text-gray-600 hover:text-blue-600'
                    : 'text-amber-300 hover:text-amber-500 font-serif'
                }`}
              >
                {item}
              </a>
            ))}
            {theme === 'personal' && (
              <a
                href="#games"
                onClick={() => setIsOpen(false)}
                className="py-2 text-amber-300 hover:text-amber-500 transition-colors duration-300 font-serif"
              >
                Games
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;