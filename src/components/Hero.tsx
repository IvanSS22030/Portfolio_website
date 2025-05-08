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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('[HackerIntro] Component did mount/remount (key changed).');
    setVisibleLines(0);
    setTypedText('');
    setTypingDone(false);
    setIsAudioReady(false);

    const audioElement = audioRef.current;
    
    // Define handlers here so they are in scope for both add and remove
    const handleCanPlayThrough = () => {
      console.log('[HackerIntro] Audio event: canplaythrough - Audio is ready to play.');
      setIsAudioReady(true);
    };
    const handleError = (e: Event) => {
      console.error('[HackerIntro] Audio event: error', e);
      setIsAudioReady(false);
    };

    if (audioElement) {
      console.log('[HackerIntro] Initializing audio element: setting up event listeners and loading.');
      audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.addEventListener('error', handleError);
      audioElement.load();
    } else {
      console.log('[HackerIntro] audioRef.current is null on mount.');
    }
    
    return () => {
      console.log('[HackerIntro] Component will unmount. Cleaning up timers, audio, and event listeners.');
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (startTypingTimeoutRef.current) clearTimeout(startTypingTimeoutRef.current);
      
      // Only try to remove listeners and pause if audioElement was available
      if (audioElement) {
        audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
        audioElement.removeEventListener('error', handleError);
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  // Show hacker lines one by one
  useEffect(() => {
    if (visibleLines < hackerLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(v => v + 1);
      }, 1100);
      return () => clearTimeout(timeout);
    } else if (visibleLines === hackerLines.length && !typingDone && typedText.length === 0) {
      console.log('[HackerIntro] All hacker lines shown. Scheduling name typing.');
      startTypingTimeoutRef.current = setTimeout(() => {
        console.log('[HackerIntro] Starting name typing animation.');
        startNameTyping();
      }, 500);
      return () => {
        if (startTypingTimeoutRef.current) clearTimeout(startTypingTimeoutRef.current);
      };
    }
  }, [visibleLines, typingDone, typedText.length]);

  const startNameTyping = () => {
    if (!audioRef.current) {
      console.error('[HackerIntro] Cannot start typing: audioRef is null.');
      return;
    }

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    let currentIndex = 0;
    let audioElements: HTMLAudioElement[] = []; // Track all audio elements

    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < finalLine.length) {
        setTypedText(finalLine.substring(0, currentIndex + 1));
        
        if (audioRef.current && isAudioReady) {
          const audioClone = audioRef.current.cloneNode() as HTMLAudioElement;
          audioClone.volume = 0.2;
          audioElements.push(audioClone); // Add to tracking array
          
          const playPromise = audioClone.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Remove audio element after it finishes playing
                audioClone.addEventListener('ended', () => {
                  const index = audioElements.indexOf(audioClone);
                  if (index > -1) {
                    audioElements.splice(index, 1);
                  }
                });
              })
              .catch(error => {
                console.warn(`[HackerIntro] Sound play failed: ${error.message}`);
              });
          }
        }
        currentIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        // Stop and cleanup all remaining audio elements
        audioElements.forEach(audio => {
          audio.pause();
          audio.remove();
        });
        audioElements = [];
        setTypingDone(true);
      }
    }, 80);

    // Cleanup function to stop all audio when component unmounts or theme changes
    return () => {
      audioElements.forEach(audio => {
        audio.pause();
        audio.remove();
      });
      audioElements = [];
    };
  };

  useEffect(() => {
    if (typingDone) {
      console.log('[HackerIntro] typingDone is true. Ensuring all audio is stopped.');
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      // Also stop any cloned audio elements that might still be playing
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        if (audio !== audioRef.current) {
          audio.pause();
          audio.remove();
        }
      });
    }
  }, [typingDone]);

  const showCursor = !typingDone && visibleLines === hackerLines.length && typedText.length < finalLine.length;
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