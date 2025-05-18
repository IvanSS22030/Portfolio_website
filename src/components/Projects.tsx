import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { projects } from '../data/projects';
import ImageCarousel from './ImageCarousel';

const Projects: React.FC = () => {
  const { theme } = useTheme();

  const professionalProjects = (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100"
            >
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  {project.images ? (
                    <ImageCarousel 
                      images={project.images} 
                      className="h-full w-full" 
                      overlayColor="white"
                      overlayOpacity={0.1}
                      hoverOverlayOpacity={0}
                    />
                  ) : project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="max-h-full max-w-full object-contain p-2 transform transition-transform duration-500 hover:scale-105"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200 transition-all duration-300 hover:bg-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a 
                  href={project.link} 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300 hover:shadow-md hover:shadow-blue-200"
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
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  {project.images ? (
                    <ImageCarousel 
                      images={project.images} 
                      className="h-full w-full" 
                      overlayColor="black"
                      overlayOpacity={0.6}
                      hoverOverlayOpacity={0.2}
                    />
                  ) : project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="max-h-full max-w-full object-contain p-2 transform transition-transform duration-500 hover:scale-105 z-0"
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative z-20">
                      <span className="text-amber-200">No image available</span>
                    </div>
                  )}
                </div>
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