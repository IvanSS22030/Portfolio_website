// Theme types
export type Theme = 'professional' | 'personal';

// Utility type for readonly arrays
export type ReadonlyRecord<K extends keyof any, T> = Readonly<Record<K, T>>;

// Game-related types
export interface GameItem {
  readonly id: number;
  readonly title: string;
  readonly image: string;
  readonly video: string;
  readonly description: string;
}

// Project-related types
export interface ProjectItem {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly image: string;
  readonly link: string;
}

// Experience-related types
export interface WorkExperience {
  readonly id: number;
  readonly company: string;
  readonly position: string;
  readonly period: string;
  readonly description: string;
}

// Skill-related types
export interface Skill {
  readonly id: number;
  readonly name: string;
  readonly level: number;
}

// Navigation constants
export const NAV_ITEMS = ['Home', 'About', 'Skills', 'Projects', 'Contact'] as const;
export type NavItem = typeof NAV_ITEMS[number];

// Theme-related constants
export const THEME_STORAGE_KEY = 'portfolio-theme';
export const DEFAULT_THEME: Theme = 'professional';

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
} as const;

// Common interface for components with theme support
export interface ThemedComponentProps {
  theme?: Theme;
  className?: string;
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Utility function for type assertions
export function assertIsTheme(value: unknown): asserts value is Theme {
  if (value !== 'professional' && value !== 'personal') {
    throw new Error(`Invalid theme value: ${value}`);
  }
}

// Type guard for theme
export function isTheme(value: unknown): value is Theme {
  return value === 'professional' || value === 'personal';
}