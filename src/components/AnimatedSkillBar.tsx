import React, { useEffect, useState, useRef } from 'react';

interface AnimatedSkillBarProps {
  level: number;
  color: string;
  bgColor: string;
  id: number;
  theme: string;
}

const AnimatedSkillBar: React.FC<AnimatedSkillBarProps> = ({
  level,
  color,
  bgColor,
  id,
  theme
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const animationId = `${id}-${theme}`; // Unique ID for each bar per theme

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -20% 0px'
      }
    );

    const currentRef = barRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [theme]); // Reset when theme changes

  return (
    <div 
      ref={barRef}
      className={`w-full ${bgColor} rounded-full h-2.5 overflow-hidden`}
      key={animationId}
    >
      <div 
        className={`h-2.5 rounded-full ${color}`}
        style={{
          width: isVisible ? `${level}%` : '0%',
          transition: 'width 1s ease-out',
          transitionDelay: isVisible ? `${(id % 8) * 0.1}s` : '0s',
          opacity: isVisible ? 1 : 0.8
        }}
      />
    </div>
  );
};

export default AnimatedSkillBar;
