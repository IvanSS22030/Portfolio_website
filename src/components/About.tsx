import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import backgroundVideo from '../assets/videos/Castlevania_Media.mp4';

const About: React.FC = () => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && theme === 'personal') {
            // Video is visible and we're in personal theme
            video.muted = false;
            video.volume = 1;
            video.play().catch(error => {
              console.log("Video play failed:", error);
            });
          } else {
            // Video is not visible or we're in professional theme
            video.muted = true;
          }
        });
      },
      {
        threshold: 0.7, // Video must be 70% visible
        rootMargin: '0px' // No margins for more precise detection
      }
    );

    observer.observe(container);

    // Initial setup
    if (theme === 'personal') {
      video.muted = true; // Start muted
      video.play().catch(error => {
        console.log("Initial video play failed:", error);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  const professionalAbout = (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">About Me</h2>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Ivan Joel Sanchez Santana" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Web Developer & Software Engineer</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              With a passion for creating elegant, efficient solutions to complex problems, I've dedicated my career to mastering the art and science of software development. My expertise spans front-end and back-end technologies, with a focus on creating exceptional user experiences.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through technical writing and mentoring.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#skills" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                My Skills
              </a>
              <a 
                href="#" 
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
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