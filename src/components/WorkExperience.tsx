import React from 'react';
import { experiences } from '../data/experience';
import { useTheme } from '../context/ThemeContext';

const WorkExperience: React.FC = () => {
  const { theme } = useTheme();

  // Only render in professional mode
  if (theme !== 'professional') {
    return null;
  }

  return (
    <section id="experience" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Work Experience</h2>
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div 
              key={exp.id}
              className={`relative pl-8 pb-12 ${
                index === experiences.length - 1 ? '' : 'border-l-2 border-blue-200'
              }`}
            >
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-blue-600"></div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                  <span className="text-blue-600 font-medium">{exp.period}</span>
                </div>
                <h4 className="text-gray-700 mb-4">{exp.company}</h4>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;