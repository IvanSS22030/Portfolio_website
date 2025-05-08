import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Ivan Joel Sanchez | Portfolio',
  description = 'Portfolio showcasing web development and software engineering projects by Ivan Joel Sanchez',
  image = '/og-image.jpg',
  type = 'website',
}) => {
  const { theme } = useTheme();
  const siteUrl = 'https://ivanjoel.com'; // Replace with your actual domain

  // Theme-specific metadata
  const themeTitle = theme === 'professional'
    ? title
    : `${title} | The Castlevania Portfolio`;

  const themeDescription = theme === 'professional'
    ? description
    : 'Enter the dark realm of web development and software engineering, where code meets gothic inspiration';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{themeTitle}</title>
      <meta name="title" content={themeTitle} />
      <meta name="description" content={themeDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={themeTitle} />
      <meta property="og:description" content={themeDescription} />
      <meta property="og:image" content={`${siteUrl}${image}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={themeTitle} />
      <meta property="twitter:description" content={themeDescription} />
      <meta property="twitter:image" content={`${siteUrl}${image}`} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content={theme === 'professional' ? '#ffffff' : '#000000'} />
      <meta name="author" content="Ivan Joel Sanchez" />
      <meta name="keywords" content={
        theme === 'professional'
          ? 'web development, software engineering, react, typescript, portfolio'
          : 'web development, game development, castlevania, portfolio, gothic design'
      } />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />

      {/* Preload Critical Resources */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Pirata+One&display=swap"
        as="style"
      />
      <link 
        rel="preload" 
        href={theme === 'personal' ? '/src/assets/videos/Castlevania_Media.mp4' : undefined}
        as="video"
      />
    </Helmet>
  );
};

export default SEO;