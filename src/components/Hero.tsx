import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const { theme } = useTheme();

  const professionalHero = (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 pt-16"
    >
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Ivan Joel Sanchez Santana
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
          Web Developer & Software Engineer
        </p>
        <div className="flex space-x-4">
          <a 
            href="#about" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Learn More
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
          >
            Contact Me
          </a>
        </div>
        <div className="absolute bottom-8 animate-bounce">
          <a href="#about" aria-label="Scroll down">
            <ChevronDown className="h-8 w-8 text-gray-600" />
          </a>
        </div>
      </div>
    </section>
  );

  const personalHero = (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center bg-cover bg-center pt-16 relative overflow-hidden"
      style={{ 
        backgroundImage: `url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold font-serif text-amber-500 mb-6 tracking-wider">
          Ivan Joel Sanchez Santana
        </h1>
        <p className="text-xl md:text-2xl text-amber-300 mb-8 max-w-2xl font-serif">
          Slayer of Code & Creatures of the Night
        </p>
        <div className="flex space-x-4">
          <a 
            href="#about" 
            className="px-6 py-3 bg-amber-800 text-amber-100 rounded-md border border-amber-600 hover:bg-amber-900 transition-colors duration-300 font-serif"
          >
            Enter If You Dare
          </a>
          <a 
            href="#contact" 
            className="px-6 py-3 border border-amber-600 text-amber-400 rounded-md hover:bg-amber-900 hover:bg-opacity-50 transition-colors duration-300 font-serif"
          >
            Summon Me
          </a>
        </div>
        <div className="absolute bottom-8 animate-bounce">
          <a href="#about" aria-label="Scroll down">
            <ChevronDown className="h-8 w-8 text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalHero : personalHero;
};

export default Hero;