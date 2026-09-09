import React, { lazy, Suspense, useState, useEffect } from 'react';

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
import { LinuxLabCard } from './components/LinuxLabCard';

// Standalone Linux Practice Lab Page & WhatsApp Chatbot
const LinuxLabPage = lazy(() =>
  import('./components/linux-lab/LinuxLabPage').then((m) => ({ default: m.LinuxLabPage }))
);
const WhatsAppChatbot = lazy(() => import('./components/WhatsAppChatbot'));

function MainLayout() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (
        path === '/linux-lab' ||
        path === '/linux-practice-lab' ||
        search.includes('view=linux-lab') ||
        hash === '#linux-lab'
      ) {
        return 'linux-lab';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (
        path === '/linux-lab' ||
        path === '/linux-practice-lab' ||
        search.includes('view=linux-lab') ||
        hash === '#linux-lab'
      ) {
        setCurrentView('linux-lab');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLaunchLab = () => {
    try {
      const newWin = window.open('/linux-lab', '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.history.pushState({}, '', '/linux-lab');
        setCurrentView('linux-lab');
      }
    } catch {
      window.history.pushState({}, '', '/linux-lab');
      setCurrentView('linux-lab');
    }
  };

  const handleReturnToPortfolio = () => {
    window.history.pushState({}, '', '/');
    setCurrentView('home');
  };

  if (currentView === 'linux-lab') {
    return (
      <Suspense
        fallback={
          <div className="h-screen w-screen bg-[#0d1117] flex flex-col items-center justify-center text-emerald-400 font-mono space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Initializing Linux Practice Lab...</p>
          </div>
        }
      >
        <LinuxLabPage onBackToPortfolio={handleReturnToPortfolio} />
      </Suspense>
    );
  }

  return (
    <div
      className={`min-h-screen font-sans selection:bg-cyan-500 selection:text-black relative transition-colors duration-300 ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <ScrollProgress />
      <MotionBackground />
      <Preloader />
      <Navbar />
      <Hero />
      <AboutMe />
      <TechnicalSkills />
      <Experience />
      <Projects />
      <LinuxLabCard onLaunch={handleLaunchLab} />
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
