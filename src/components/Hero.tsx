import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown } from 'lucide-react';
import typewriterSound from '../assets/Sounds/typewriter.wav';

// Typing animation keyframes
const typingAnimation = `
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  50% { border-color: transparent }
}`;

const hackerLines = [
  '[*] Establishing secure connection...',
  '[*] Probing host...',
  '[*] Accessing /etc/passwd',
  '[*] Hash found: 9f86d081884c7d659a2feaa0c55ad015',
  '[*] Attempting decryption...',
  '[*] Bypassing salts and encryption layers...',
  '[*] Matching hash to known pattern...',
  '[*] Decryption complete.',
  '[*] Identity confirmed:',
];

const finalLine = 'user_decrypted: Ivan Joel Sanchez Santana';

const HackerIntro: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const [isTypingActive, setIsTypingActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset animation state on component mount/remount
  useEffect(() => {
    setVisibleLines(0);
    setTypedText('');
    setTypingDone(false);
    setIsTypingActive(false);
    
    // Make sure audio is loaded and ready
    if (audioRef.current) {
      audioRef.current.load();
    }
    
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Show hacker lines one by one
  useEffect(() => {
    if (visibleLines < hackerLines.length) {
      const timeout = setTimeout(() => setVisibleLines(v => v + 1), 1100);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  // Start typing the final line after all hacker lines are shown
  useEffect(() => {
    if (visibleLines === hackerLines.length && !typingDone && !isTypingActive) {
      // Set typing as active to prevent duplicate intervals
      setIsTypingActive(true);
      
      // Ensure audio is loaded and ready before typing starts
      if (audioRef.current) {
        audioRef.current.load();
      }
      
      let currentIndex = 0;
      
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      const typeNextChar = () => {
        if (currentIndex < finalLine.length) {
          // Play sound first, then add the character - ensures tight audio sync
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
          
          // Add the next character from the finalLine
          setTypedText(finalLine.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          // Typing is complete - stop audio and clear interval
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          
          clearInterval(typingIntervalRef.current!);
          setTypingDone(true);
          setIsTypingActive(false);
        }
      };
      
      typingIntervalRef.current = setInterval(typeNextChar, 80);
      
      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        // Stop any playing audio if component unmounts mid-typing
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
  }, [visibleLines, typingDone, isTypingActive]);

  const showCursor = !typingDone && visibleLines === hackerLines.length;
  const displayName = typedText.replace('user_decrypted: ', '');

  return (
    <div className="flex flex-col items-center justify-center min-h-[120px] md:min-h-[160px] mb-6">
      <style>{typingAnimation}</style>
      <audio ref={audioRef} src={typewriterSound} preload="auto" />
      <div className="font-mono text-green-400 text-base md:text-lg text-left w-full max-w-xl mx-auto select-none">
        {hackerLines.map((line, i) => (
          <div key={i} className={`transition-opacity duration-500 ${visibleLines > i ? 'opacity-100' : 'opacity-0'}`}>{line}</div>
        ))}
        <div className="h-8 md:h-12 flex justify-center">
          {visibleLines === hackerLines.length && (
            <span
              className="inline-block whitespace-nowrap overflow-visible border-orange-500 pr-2 font-serif font-bold text-3xl md:text-6xl text-orange-500 text-center w-full"
              style={{
                borderRight: showCursor ? '4px solid #f59e42' : 'none',
              }}
            >
              {displayName}{showCursor && <span className="animate-[blink_0.7s_step-end_infinite]">|</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { theme } = useTheme();
  const [showTyping, setShowTyping] = useState(false);
  const [key, setKey] = useState(0); // Key to force HackerIntro remount on theme switch

  useEffect(() => {
    if (theme === 'professional') {
      setShowTyping(false);
      setTimeout(() => setShowTyping(true), 100);
    } else {
      // Force HackerIntro to remount when switching to personal theme
      setKey(prev => prev + 1);
    }
  }, [theme]);

  const professionalHero = (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 pt-16"
    >
      <style>{typingAnimation}</style>
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          {showTyping ? (
            <span
              className="inline-block whitespace-nowrap overflow-hidden border-r-4 border-indigo-600 pr-2"
              style={{
                width: '0%',
                animation: 'typing 3.5s steps(28, end) forwards, blink 0.7s step-end infinite',
                animationDelay: '0.2s,3.5s',
                animationFillMode: 'forwards',
              }}
            >
              Ivan Joel Sanchez Santana
            </span>
          ) : (
            <span className="opacity-0">Ivan Joel Sanchez Santana</span>
          )}
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
        <HackerIntro key={key} />
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