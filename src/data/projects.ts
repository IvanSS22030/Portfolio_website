import { ProjectItem } from '../types';

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: "2D Game Development",
    description: "An interactive 2D game built with Phaser.js featuring custom tilemap manipulation and game mechanics.",
    technologies: ["Javascript", "Phaser.js", "Git", "Tilemap Manipulation"],
    image: "/images/projects/Portfolio Game.png",
    link: "#game-project"
  },
  {
    id: 2,
    title: "Data Visualization Dashboards",
    description: "Interactive business intelligence dashboards with advanced data modeling and visualization capabilities.",
    technologies: ["Data-cleaning", "DAX", "Power Query", "Power BI"],
    images: [
      "/images/projects/Adidas Dashboard.png",
      "/images/projects/Europe Bikes.png",
      "/images/projects/Games.png"
    ],
    link: "#data-dashboard"
  },
  {
    id: 3,
    title: "AI Voice Cloning",
    description: "Advanced voice cloning and synthesis using RVC (Retrieval-based Voice Conversion) technology.",
    technologies: ["RVC", "Model Training", "Hugging Face", "Python", "Batch"],
    image: "/images/projects/abinadersh.jpeg",
    link: "#voice-cloning"
  }
];