import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import TechnicalSkills from './components/TechnicalSkills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GeminiChatbot from './components/GeminiChatbot';

function MainLayout() {
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-[#ff2a2a] selection:text-white relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
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
      <GeminiChatbot />
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
