export type Theme = 'professional' | 'personal';

export interface GameItem {
  id: number;
  title: string;
  image: string;
  video: string;
  description: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}