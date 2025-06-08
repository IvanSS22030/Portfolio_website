import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import '../styles/GooeyCursor.css';

const GooeyCursor = () => {
  const [isInside, setIsInside] = useState(false);
  const isInsideRef = useRef(isInside);
  isInsideRef.current = isInside;

  const [bubbleSpring, bubbleApi] = useSpring(() => ({
    x: -200, // Start off-screen
    y: -200,
    config: { mass: 4, tension: 80, friction: 50 },
  }));

  const [trailSpring, trailApi] = useSpring(() => ({
    x: -200,
    y: -200,
    config: { mass: 3, tension: 100, friction: 45 },
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
        bubbleApi.start({ x: e.clientX, y: e.clientY });
        trailApi.start({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [bubbleApi, trailApi]);

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
        <animated.div 
          className="cursor-bubble"
          style={{ 
            transform: to([bubbleSpring.x, bubbleSpring.y], (x, y) => 
              `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
            ) 
          }}
        />
        <animated.div 
          className="cursor-trail"
          style={{ 
            transform: to([trailSpring.x, trailSpring.y], (x, y) => 
              `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`
            ) 
          }}
        />
      </div>
    </>
  );
};

export default GooeyCursor; 