import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import backgroundVideo from '../assets/videos/Castlevania_Media.mp4';
import professionalImage from '../assets/images/profile pictures/professional site image.jpg';

// Add these CSS keyframes at the top of your component
const typingAnimation = `
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

@keyframes blink {
  50% { border-color: transparent }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.2);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}
`;

const About: React.FC = () => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  // Smooth audio fade function
  const fadeAudio = (video: HTMLVideoElement, targetVolume: number, duration: number = 1000) => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const startVolume = video.volume;
    const startTime = performance.now();
    
    // Animation function
    const animate = (currentTime: number) => {
      // Calculate elapsed time and progress percentage
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current volume using smooth easing
      const newVolume = startVolume + (targetVolume - startVolume) * progress;
      video.volume = Math.max(0, Math.min(1, newVolume)); // Clamp between 0 and 1
      
      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (targetVolume === 0 && !isVideoVisible) {
          // If faded out completely and video is not visible, pause it
          video.pause();
        }
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;
    
    // Set initial state
    video.volume = 0;
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        // Store visibility state
        setIsVideoVisible(entry.isIntersecting);
        
        if (entry.isIntersecting && theme === 'personal') {
          // Video is visible in personal theme
          video.play().catch(error => {
            console.log("Video play failed:", error);
          });
          
          // Fade in audio
          fadeAudio(video, 1, 1500);
        } else {
          // Video is not visible or not in personal theme
          fadeAudio(video, 0, 1000);
        }
      },
      {
        threshold: 0.5, // Trigger when 50% visible
        rootMargin: '-10% 0px' // Adjust this to fine-tune when fading starts
      }
    );
    
    // Start observing
    observer.observe(container);
    
    // Always make sure video is playing in personal theme
    if (theme === 'personal') {
      video.play().catch(error => {
        console.log("Initial play failed:", error);
      });
    }
    
    // Cleanup function
    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  // New useEffect for scroll animations
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      });
    }, options);

    const section = document.getElementById('about');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.disconnect();
      }
    };
  }, []);

  const professionalAbout = (
    <>
      <style>{typingAnimation}</style>
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 ${isInView ? 'animate-[fadeInUp_0.6s_ease-in-out_forwards]' : 'opacity-0'}`}>About Me</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Image with enhanced animation */}
            <div className={`md:w-1/2 flex justify-center items-center md:h-full ${isInView ? 'animate-[fadeInLeft_0.7s_ease-in-out_0.2s_forwards]' : 'opacity-0'}`}>
              <div className="w-48 h-64 md:w-72 md:h-[22rem] bg-white rounded-xl overflow-hidden shadow-lg flex items-center justify-center group">
                <div className="w-full h-full overflow-hidden relative 
                  before:absolute before:inset-0 before:z-10 before:bg-indigo-500/0 before:transition-all before:duration-700
                  group-hover:before:bg-indigo-500/10">
                  <img 
                    src={professionalImage} 
                    alt="Professional profile" 
                    className="w-full h-full object-cover object-center rounded-xl transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 group-hover:translate-y-[-5px]"
                  />
                </div>
              </div>
            </div>
            
            {/* Text content with animations */}
            <div className={`md:w-1/2 ${isInView ? 'animate-[fadeInRight_0.7s_ease-in-out_0.3s_forwards]' : 'opacity-0'}`}>
              <h3 className={`text-2xl font-semibold text-gray-800 mb-4 ${isInView ? 'animate-[fadeInUp_0.6s_ease-in-out_0.7s_forwards]' : 'opacity-0'}`}>
                Web Developer & Software Engineer
              </h3>
              <p className={`text-gray-600 mb-6 leading-relaxed ${isInView ? 'animate-[fadeInUp_0.6s_ease-in-out_0.9s_forwards]' : 'opacity-0'}`}>
                With a passion for creating elegant, efficient solutions to complex problems, I've dedicated my career to mastering the art and science of software development. My expertise spans front-end and back-end technologies, with a focus on creating exceptional user experiences.
              </p>
              <p className={`text-gray-600 mb-6 leading-relaxed ${isInView ? 'animate-[fadeInUp_0.6s_ease-in-out_1.1s_forwards]' : 'opacity-0'}`}>
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.
              </p>
              
              {/* Enhanced buttons */}
              <div className={`flex space-x-4 ${isInView ? 'animate-[fadeInUp_0.6s_ease-in-out_1.3s_forwards]' : 'opacity-0'}`}>
                <a 
                  href="#skills" 
                  className="group relative px-6 py-3 bg-indigo-600 text-white rounded-md overflow-hidden transition-all duration-500"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-1px]">My Skills</span>
                  <span className="absolute inset-0 bg-indigo-700 translate-y-[105%] transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
                </a>
                <a 
                  href="#" 
                  className="group relative px-6 py-3 border border-indigo-500 text-indigo-600 rounded-md overflow-hidden transition-all duration-500 hover:text-white hover:shadow-md"
                >
                  <span className="relative z-10 transition-transform duration-500 group-hover:translate-y-[-1px]">Download CV</span>
                  <span className="absolute inset-0 bg-indigo-600 translate-y-[105%] transition-transform duration-500 ease-out group-hover:translate-y-0"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const personalAbout = (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Video Background */}
      <div ref={videoContainerRef} className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={theme !== 'personal'} // Only unmuted in personal theme
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">The Chronicle of Ivan</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="aspect-square bg-amber-900 rounded-lg overflow-hidden border border-amber-800 shadow-xl">
              <img 
                src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Ivan Joel Sanchez Santana" 
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold text-amber-400 mb-4 font-serif">Master of the Digital Realm</h3>
            <p className="text-amber-200 mb-6 leading-relaxed">
              From the shadows of binary wastelands to the heights of algorithmic castles, I have journeyed through the digital realm mastering arcane languages and conquering complex systems. My powers extend beyond mere mortal coding—I bend both front-end and back-end to my will.
            </p>
            <p className="text-amber-200 mb-6 leading-relaxed">
              When not slaying bugs or summoning new applications from the void, I commune with fellow wizards, share mystical knowledge, and collect rare artifacts of gaming lore.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#skills" 
                className="px-6 py-3 bg-amber-800 text-amber-100 rounded-md border border-amber-700 hover:bg-amber-900 transition-colors duration-300 font-serif"
              >
                My Powers
              </a>
              <a 
                href="#" 
                className="px-6 py-3 border border-amber-700 text-amber-400 rounded-md hover:bg-amber-900 hover:bg-opacity-50 transition-colors duration-300 font-serif"
              >
                Ancient Scroll
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalAbout : personalAbout;
};

export default About;