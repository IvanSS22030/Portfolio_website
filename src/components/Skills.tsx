import React from 'react';
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

  return (
    <section id="skills" className={`py-20 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-center ${titleColor} mb-12 ${titleFont}`}>
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className={`${cardBg} p-6 rounded-lg shadow-md ${borderColor}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-semibold ${textColor} ${titleFont}`}>
                  {skill.name}
                </h3>
                <span className={`text-sm ${percentageColor}`}>
                  {skill.level}%
                </span>
              </div>
              <div className={`w-full ${progressBg} rounded-full h-2.5 overflow-hidden`}>
                <div 
                  className={`h-2.5 rounded-full ${progressColor}`}
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;