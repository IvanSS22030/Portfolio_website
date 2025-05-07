import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import WorkExperience from './components/WorkExperience';
import FavoriteGames from './components/FavoriteGames';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <WorkExperience />
          <FavoriteGames />
          <Contact />
        </main>
        <Footer />
        <ThemeToggle />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
}

export default App;