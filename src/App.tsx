import React, { lazy, Suspense } from 'react';

import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import MotionBackground from './components/MotionBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Footer from './components/Footer';
import SectionFallback from './components/SectionFallback';

// Lazy loading heavy components with React.lazy to reduce initial bundle size and speed up first paint
const TechnicalSkills = lazy(() => import('./components/TechnicalSkills'));
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Certificates = lazy(() => import('./components/Certificates'));
const Education = lazy(() => import('./components/Education'));
const Contact = lazy(() => import('./components/Contact'));
const GeminiChatbot = lazy(() => import('./components/GeminiChatbot'));

function MainLayout() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500 selection:text-black relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <ScrollProgress />
      <MotionBackground />
      <Preloader />
      <Navbar />
      <Hero />
      <AboutMe />

      <Suspense fallback={<SectionFallback minHeight="min-h-[500px]" title="Technical Skills" />}>
        <TechnicalSkills />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="min-h-[600px]" title="Professional Experience" />}>
        <Experience />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="min-h-[600px]" title="Featured Projects" />}>
        <Projects />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="min-h-[500px]" title="Certifications" />}>
        <Certificates />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="min-h-[400px]" title="Education" />}>
        <Education />
      </Suspense>

      <Suspense fallback={<SectionFallback minHeight="min-h-[600px]" title="Contact Section" />}>
        <Contact />
      </Suspense>

      <Footer />

      <Suspense fallback={null}>
        <GeminiChatbot />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PortfolioProvider>
          <MainLayout />
        </PortfolioProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
