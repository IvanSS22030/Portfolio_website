import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { skills } from '../data/skills';

const Skills: React.FC = () => {
  const { theme } = useTheme();

  // Filter skills based on the current theme
  const filteredSkills = skills.filter(skill => skill.category === theme);
  const title = theme === 'professional' ? 'My Skills' : 'Arcane Powers';
  const bgColor = theme === 'professional' ? 'bg-gray-50' : 'bg-black bg-opacity-80';
  const titleColor = theme === 'professional' ? 'text-gray-800' : 'text-amber-500';
  const cardBg = theme === 'professional' ? 'bg-white' : 'bg-gray-900';
  const textColor = theme === 'professional' ? 'text-gray-800' : 'text-amber-400';
  const percentageColor = theme === 'professional' ? 'text-gray-600' : 'text-amber-300';
  const progressBg = theme === 'professional' ? 'bg-gray-200' : 'bg-gray-800';
  const progressColor = theme === 'professional' ? 'bg-blue-600' : 'bg-amber-600';
  const borderColor = theme === 'professional' ? '' : 'border border-amber-900';
  const titleFont = theme === 'professional' ? 'font-sans' : 'font-serif';

  const skillRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [animatedSkills, setAnimatedSkills] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-skill-id');
            if (id) {
              setAnimatedSkills(prev => ({
                ...prev,
                [id]: true
              }));
              // Unobserve after animation is triggered
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px'
      }
    );

    // Store current refs in a variable to avoid issues with cleanup
    const currentRefs = skillRefs.current;
    
    // Observe all current refs
    Object.values(currentRefs).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // Cleanup only the refs that were observed
      Object.values(currentRefs).forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const getProgressBarStyle = (skillId: number, level: number) => ({
    width: animatedSkills[skillId] ? `${level}%` : '0%',
    transition: 'width 1s ease-out',
    transitionDelay: `${(skillId % 8) * 0.1}s` // Use modulo to prevent large delays
  });

  return (
    <section id="skills" className={`py-20 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-center ${titleColor} mb-12 ${titleFont}`}>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {filteredSkills.map((skill) => (
            <div 
              key={skill.id}
              ref={el => {
                if (el) {
                  skillRefs.current[skill.id] = el;
                } else {
                  delete skillRefs.current[skill.id];
                }
              }}
              data-skill-id={skill.id}
              className={`${cardBg} p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${borderColor}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-semibold ${textColor} ${titleFont} transition-colors duration-300`}>
                  {skill.name}
                </h3>
                <span className={`text-sm font-medium ${percentageColor} transition-colors duration-300`}>
                  {skill.level}%
                </span>
              </div>
              <div className={`w-full ${progressBg} rounded-full h-2.5 overflow-hidden`}>
                <div 
                  className={`h-2.5 rounded-full ${progressColor}`}
                  style={getProgressBarStyle(skill.id, skill.level)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;