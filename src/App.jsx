import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import ProjectDetail from './components/ProjectDetail';
import AboutPage from './components/AboutPage';
import Privacy from './components/Privacy';
import CalcuweighterPromo from './components/CalcuweighterPromo';
import ScrollToTop from './components/ScrollToTop';

function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <About />
    </>
  );
}

function App() {
  return (
    <Router>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
        <ScrollToTop />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/calcuweighter" element={<CalcuweighterPromo />} />
          </Routes>
        </main>
      </ReactLenis>
    </Router>
  );
}

export default App;
