import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { skills } from '../data/skills';

const Skills: React.FC = () => {
  const { theme } = useTheme();

  const professionalSkills = (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">My Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
                <span className="text-sm text-gray-600">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const personalSkills = (
    <section id="skills" className="py-20 bg-black bg-opacity-80">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">Arcane Powers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-gray-900 p-6 rounded-lg shadow-lg border border-amber-900">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-amber-400 font-serif">{skill.name}</h3>
                <span className="text-sm text-amber-300">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalSkills : personalSkills;
};

export default Skills;