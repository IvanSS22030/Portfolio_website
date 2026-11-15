import React from 'react';
import { render, waitFor } from '@testing-library/react';
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

// Helmet writes to <head> asynchronously, after the render
const metaContent = (selector: string) => document.head.querySelector(selector)?.getAttribute('content');

describe('SEO', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders professional theme meta tags correctly', async () => {
    localStorage.setItem('portfolio-theme', 'professional');
    renderWithProviders(<SEO />);

    // Check title
    await waitFor(() => expect(document.title).toBe('Ivan Joel Sanchez | Portfolio'));

    // Check meta tags
    expect(metaContent('meta[name="theme-color"]')).toBe('#ffffff');
    expect(metaContent('meta[name="keywords"]')).toContain('web development, software engineering');
  });

  it('renders personal theme meta tags correctly', async () => {
    localStorage.setItem('portfolio-theme', 'personal');
    renderWithProviders(<SEO />);

    // Check meta tags
    await waitFor(() => expect(metaContent('meta[name="theme-color"]')).toBe('#000000'));

    // Check title includes Castlevania reference
    expect(document.title).toBe('Ivan Joel Sanchez | Portfolio | The Castlevania Portfolio');
    expect(metaContent('meta[name="keywords"]')).toContain('game development, castlevania');
  });

  it('handles custom props correctly', async () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom description',
      image: '/custom-image.jpg',
      type: 'article'
    };

    renderWithProviders(<SEO {...customProps} />);

    // Check custom meta tags
    await waitFor(() => expect(metaContent('meta[property="og:title"]')).toContain('Custom Title'));
    expect(metaContent('meta[property="og:description"]')).toBe('Custom description');
    expect(metaContent('meta[property="og:image"]')).toContain('/custom-image.jpg');
    expect(metaContent('meta[property="og:type"]')).toBe('article');
  });

  it('preloads the fonts and no video', async () => {
    localStorage.setItem('portfolio-theme', 'personal');
    renderWithProviders(<SEO />);

    // Check font preload
    await waitFor(() => expect(document.head.querySelector('link[rel="preload"][as="style"]')).toBeTruthy());
    expect(document.head.querySelector('link[rel="preload"][as="style"]')?.getAttribute('href'))
      .toContain('fonts.googleapis.com');

    // The Castlevania video is loaded by the About section; preloading it pointed at a missing path
    expect(document.head.querySelector('link[rel="preload"][as="video"]')).toBeNull();
  });
});
