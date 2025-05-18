import React, { useRef, useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface AnimatedProgressBarProps {
  level: number;
  color: string;
  bgColor: string;
  height?: string;
  duration?: number;
  delay?: number;
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  level,
  color,
  bgColor,
  height = '0.625rem', // h-2.5 = 0.625rem
  duration = 1000,
  delay = 0,
}) => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(progressRef, {
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      let start = 0;
      const end = level;
      const increment = end / (duration / 16); // 60fps

      const animate = () => {
        start += increment;
        if (start < end) {
          setProgress(Math.ceil(start));
          requestAnimationFrame(animate);
        } else {
          setProgress(end);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, level, duration, delay]);

  return (
    <div 
      ref={progressRef}
      className={`w-full rounded-full overflow-hidden ${bgColor}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out`}
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          transitionProperty: 'width',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
