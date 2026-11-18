import { ProjectItem } from '../types';

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: "2D Game Development",
    description: "A top-down pixel-art game built with Phaser 3: a village, a river crossing and a coastal city, house interiors and NPCs that wander and talk. It has its own map and collision editor, and a custom MCP server lets AI agents inspect and test the live game.",
    technologies: ["JavaScript", "Phaser 3", "Arcade Physics", "Vite", "MCP"],
    images: [
      "/images/projects/game-route-1.webp",
      "/images/projects/game-route-2.webp",
      "/images/projects/game-route-3.webp"
    ],
    links: [{ url: "https://github.com/IvanSS22030/porfolio_game", kind: "repo" }]
  },
  {
    id: 2,
    title: "Dimensional View",
    description: "An interactive viewer that goes from a point (0D) to a penteract (5D), morphing between shapes and projecting 4D and 5D figures onto the screen. Its escape mode traps a ball in a cage it can only leave through the fourth axis, with real physics in five dimensions.",
    technologies: ["JavaScript", "Three.js", "WebGL", "Linear Algebra"],
    images: [
      "/images/projects/dimensional-view-4d.webp",
      "/images/projects/dimensional-view-5d.webp",
      "/images/projects/dimensional-view-escape.webp"
    ],
    links: [
      { url: "https://ivanss22030.github.io/dimensional-view/", kind: "demo" },
      { url: "https://github.com/IvanSS22030/dimensional-view", kind: "repo" }
    ]
  },
  {
    id: 3,
    title: "Champions Hit Calculator",
    description: "An offline Android app that calculates move hit probabilities for Pokémon Champions: accuracy and evasion stages, abilities, items, weather, doubles, multi-hit distributions and event sequences, with a step-by-step breakdown of every result.",
    technologies: ["Kotlin", "Jetpack Compose", "Hilt", "Room", "Material 3"],
    image: "/images/projects/champions-hit-calculator.webp",
    privateCode: true
  },
  {
    id: 4,
    title: "Data Visualization Dashboards",
    description: "Interactive business intelligence dashboards with advanced data modeling and visualization capabilities.",
    technologies: ["Data-cleaning", "DAX", "Power Query", "Power BI"],
    images: [
      "/images/projects/Adidas Dashboard.png",
      "/images/projects/Europe Bikes.png",
      "/images/projects/Games.png"
    ]
  },
  {
    id: 5,
    title: "AI Voice Cloning",
    description: "Advanced voice cloning and synthesis using RVC (Retrieval-based Voice Conversion) technology.",
    technologies: ["RVC", "Model Training", "Hugging Face", "Python", "Batch"],
    image: "/images/projects/abinadersh.jpeg",
    links: [{ url: "https://www.youtube.com/watch?v=Ku8Hwps30lg", kind: "video" }]
  }
];
