import { ProjectItem } from '../types';

export const projects: ProjectItem[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with product management, user authentication, and payment processing.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.pexels.com/photos/6956303/pexels-photo-6956303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#project-1"
  },
  {
    id: 2,
    title: "Portfolio Dashboard",
    description: "Interactive dashboard for financial portfolio management with real-time data visualization.",
    technologies: ["Vue.js", "D3.js", "Firebase", "TailwindCSS"],
    image: "https://images.pexels.com/photos/7876708/pexels-photo-7876708.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#project-2"
  },
  {
    id: 3,
    title: "Social Media App",
    description: "Mobile-first social media application with real-time messaging and content sharing.",
    technologies: ["React Native", "GraphQL", "AWS Amplify"],
    image: "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#project-3"
  }
];