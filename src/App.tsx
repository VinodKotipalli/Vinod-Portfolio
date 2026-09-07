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

import TechnicalSkills from './components/TechnicalSkills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Contact from './components/Contact';

// Floating interactive WhatsApp chatbot widget is lazy loaded
const WhatsAppChatbot = lazy(() => import('./components/WhatsAppChatbot'));

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
      <TechnicalSkills />
      <Experience />
      <Projects />
      <Certificates />
      <Education />
      <Contact />
      <Footer />

      <Suspense fallback={null}>
        <WhatsAppChatbot />
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
