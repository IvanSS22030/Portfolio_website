import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { projects } from '../data/projects';

const Projects: React.FC = () => {
  const { theme } = useTheme();

  const professionalProjects = (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const personalProjects = (
    <section id="projects" className="py-20 bg-black bg-opacity-90">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-500 mb-12 font-serif">Artifacts of Power</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-gray-900 rounded-lg overflow-hidden border border-amber-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-amber-900/20 hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-amber-400 mb-2 font-serif">{project.title}</h3>
                <p className="text-amber-200 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-amber-900 text-amber-200 text-xs rounded-full border border-amber-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  className="inline-block px-4 py-2 bg-amber-800 text-amber-100 rounded border border-amber-700 hover:bg-amber-900 transition-colors duration-300 font-serif"
                >
                  Examine Artifact
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return theme === 'professional' ? professionalProjects : personalProjects;
};

export default Projects;