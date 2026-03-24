import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Footer from './components/Footer';
import Privacy from './components/Privacy';
import ThoughtsSection from './components/ThoughtsSection';
import ThoughtsPage from './components/ThoughtsPage';
import ThoughtPost from './components/ThoughtPost';
import ScrollToTop from './components/ScrollToTop';
import PasswordGate from './components/clients/PasswordGate';
import ERPDemo from './components/clients/ERPDemo';

// Lazy-load heavy 3D pages (Three.js ~1.2MB)
const AboutPage = lazy(() => import('./components/AboutPage'));
const CalcuweightPromo = lazy(() => import('./components/CalcuweightPromo'));
const RoomscrollPromo = lazy(() => import('./components/RoomscrollPromo'));
const CookiePage = lazy(() => import('./components/CookiePage'));
const ChiaPromo = lazy(() => import('./components/ChiaPromo'));

function HomePage() {
    return (
        <>
            <Navigation />
            <Hero />
            <Work />
            <About />
            <ThoughtsSection />
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
                <ScrollToTop />
                <main>
                    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/calcuweight" element={<CalcuweightPromo />} />
                        <Route path="/roomscroll" element={<RoomscrollPromo />} />
                        <Route path="/chia" element={<ChiaPromo />} />
                        <Route path="/clients/ocd" element={
                            <PasswordGate password="ocd">
                                <ERPDemo />
                            </PasswordGate>
                        } />
                        <Route path="/cookies" element={<CookiePage />} />
                        <Route path="/thoughts" element={<ThoughtsPage />} />
                        <Route path="/thoughts/:slug" element={<ThoughtPost />} />
                    </Routes>
                    </Suspense>
                </main>
            </ReactLenis>
        </Router>
    );
}

export default App;
