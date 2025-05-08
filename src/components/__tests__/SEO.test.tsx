import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from '../../context/ThemeContext';
import SEO from '../SEO';

const renderWithProviders = (ui: React.ReactElement) => {
  const helmetContext = {};
  return render(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>{ui}</ThemeProvider>
    </HelmetProvider>
  );
};

describe('SEO', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders professional theme meta tags correctly', () => {
    localStorage.setItem('portfolio-theme', 'professional');
    renderWithProviders(<SEO />);

    // Get the helmet context
    const helmet = document.head;

    // Check title
    expect(helmet.querySelector('title')?.textContent).toBe('Ivan Joel Sanchez | Portfolio');

    // Check meta tags
    expect(helmet.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#ffffff');
    expect(helmet.querySelector('meta[name="keywords"]')?.getAttribute('content'))
      .toContain('web development, software engineering');
  });

  it('renders personal theme meta tags correctly', () => {
    localStorage.setItem('portfolio-theme', 'personal');
    renderWithProviders(<SEO />);

    const helmet = document.head;

    // Check title includes Castlevania reference
    expect(helmet.querySelector('title')?.textContent)
      .toContain('The Castlevania Portfolio');

    // Check meta tags
    expect(helmet.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#000000');
    expect(helmet.querySelector('meta[name="keywords"]')?.getAttribute('content'))
      .toContain('game development, castlevania');
  });

  it('handles custom props correctly', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom description',
      image: '/custom-image.jpg',
      type: 'article'
    };

    renderWithProviders(<SEO {...customProps} />);
    const helmet = document.head;

    // Check custom meta tags
    expect(helmet.querySelector('meta[property="og:title"]')?.getAttribute('content'))
      .toContain('Custom Title');
    expect(helmet.querySelector('meta[property="og:description"]')?.getAttribute('content'))
      .toBe('Custom description');
    expect(helmet.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toContain('/custom-image.jpg');
    expect(helmet.querySelector('meta[property="og:type"]')?.getAttribute('content'))
      .toBe('article');
  });

  it('preloads critical resources correctly', () => {
    renderWithProviders(<SEO />);
    const helmet = document.head;

    // Check font preload
    const fontPreload = helmet.querySelector('link[rel="preload"][as="style"]');
    expect(fontPreload).toBeTruthy();
    expect(fontPreload?.getAttribute('href')).toContain('fonts.googleapis.com');

    // Check video preload in personal theme
    localStorage.setItem('portfolio-theme', 'personal');
    renderWithProviders(<SEO />);
    
    const videoPreload = helmet.querySelector('link[rel="preload"][as="video"]');
    expect(videoPreload).toBeTruthy();
    expect(videoPreload?.getAttribute('href')).toContain('Castlevania_Media.mp4');
  });
});