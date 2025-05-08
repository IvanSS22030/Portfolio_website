import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundaryWithTheme from './components/ErrorBoundary';
import Header from './components/Header';
import Hero from './components/Hero';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';

// Lazy load non-critical components
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const WorkExperience = lazy(() => import('./components/WorkExperience'));
const FavoriteGames = lazy(() => import('./components/FavoriteGames'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Loading component with theme support
const Loading: React.FC = () => {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundaryWithTheme>
          <div className="min-h-screen">
            <SEO />
            <Header />
            <main>
              <Hero />
              <Suspense fallback={<Loading />}>
                <About />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <Skills />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <Projects />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <WorkExperience />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <FavoriteGames />
              </Suspense>
              <Suspense fallback={<Loading />}>
                <Contact />
              </Suspense>
            </main>
            <Suspense fallback={<Loading />}>
              <Footer />
            </Suspense>
            <ThemeToggle />
            <ScrollToTop />
          </div>
        </ErrorBoundaryWithTheme>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;