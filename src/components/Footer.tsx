import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();

  const professionalFooter = (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Ivan Joel Sanchez Santana</h3>
            <p className="text-gray-400 mt-1">Web Developer & Software Engineer</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
              Instagram
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center md:text-left">
          <p className="text-gray-400">© {year} Ivan Joel Sanchez Santana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  const personalFooter = (
    <footer className="bg-black text-amber-200 py-8 border-t border-amber-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-amber-500 font-serif">Ivan Joel Sanchez Santana</h3>
            <p className="text-amber-300 mt-1 font-serif">Master of the Digital Realm</p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-serif">
              LinkedIn
            </a>
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-serif">
              GitHub
            </a>
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-serif">
              Twitter
            </a>
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-300 font-serif">
              Instagram
            </a>
          </div>
        </div>
        
        <div className="border-t border-amber-900 mt-6 pt-6 text-center md:text-left">
          <p className="text-amber-400 font-serif">© {year} The Chronicles of Ivan Joel Sanchez Santana. All rights enchanted.</p>
        </div>
      </div>
    </footer>
  );

  return theme === 'professional' ? professionalFooter : personalFooter;
};

export default Footer;