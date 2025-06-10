import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import '../styles/GooeyCursor.css';

const GooeyCursor = () => {
  const [isInside, setIsInside] = useState(false);
  const isInsideRef = useRef(isInside);
  isInsideRef.current = isInside;

  // Red dot - follows cursor immediately (no lag)
  const [dotSpring, dotApi] = useSpring(() => ({
    x: -200,
    y: -200,
    config: { mass: 1, tension: 300, friction: 30 }, // Fast response
  }));

  // Red circle - follows cursor with slight lag
  const [circleSpring, circleApi] = useSpring(() => ({
    x: -200,
    y: -200,
    config: { mass: 2, tension: 120, friction: 40 }, // Medium response
  }));

  // Yellow gooey bubble - follows cursor with more lag
  const [bubbleSpring, bubbleApi] = useSpring(() => ({
    x: -200,
    y: -200,
    config: { mass: 4, tension: 80, friction: 50 }, // Slow response for gooey effect
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const heroSection = document.getElementById('home');
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const isCurrentlyInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      if (isCurrentlyInside !== isInsideRef.current) {
        setIsInside(isCurrentlyInside);
      }
      
      if (isCurrentlyInside) {
        // Update all cursor elements with different timing
        dotApi.start({ x: e.clientX, y: e.clientY });
        circleApi.start({ x: e.clientX, y: e.clientY });
        bubbleApi.start({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [dotApi, circleApi, bubbleApi]);

  if (!isInside) {
    return null;
  }

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div className="gooey-container">
        {/* Yellow gooey bubble - background layer */}
        <animated.div 
          className="cursor-bubble-gooey"
          style={{ 
            transform: to([bubbleSpring.x, bubbleSpring.y], (x, y) => 
              `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
            ) 
          }}
        />
        
        {/* Red circle - middle layer */}
        <animated.div 
          className="cursor-circle-red"
          style={{ 
            transform: to([circleSpring.x, circleSpring.y], (x, y) => 
              `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
            ) 
          }}
        />
        
        {/* Red dot - top layer */}
        <animated.div 
          className="cursor-dot-red"
          style={{ 
            transform: to([dotSpring.x, dotSpring.y], (x, y) => 
              `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
            ) 
          }}
        />
      </div>
    </>
  );
};

export default GooeyCursor; 