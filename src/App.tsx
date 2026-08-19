import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import { InterviewProvider, useInterview } from './context/InterviewContext';
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
import { FeaturedInterviewCard } from './components/FeaturedInterviewCard';
import { MockInterviewPlatform } from './components/interview/MockInterviewPlatform';

function MainLayout() {
  const [activeRoute, setActiveRoute] = useState<'home' | 'interview'>('home');
  const { setView } = useInterview();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
    });

    // Check if URL has #mock-interview or /mock-interview path
    const checkHash = () => {
      if (
        window.location.hash === '#mock-interview' ||
        window.location.pathname.includes('/mock-interview')
      ) {
        // Can open in dedicated focus mode or scroll
        const elem = document.getElementById('mock-interview');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenInterview = () => {
    setView('setup');
    const elem = document.getElementById('mock-interview');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ff2a2a] selection:text-white relative">
      <Preloader />
      <Navbar onNavigateMockInterview={handleOpenInterview} />
      <Hero />
      <AboutMe />
      <TechnicalSkills />
      <Experience />
      <Projects />

      {/* Featured AI Live Mock Interview Showcase Banner */}
      <FeaturedInterviewCard onOpenInterview={handleOpenInterview} />

      <Certificates />

      {/* Dedicated AI Live Mock Interview Platform Section */}
      <section id="mock-interview" className="relative py-12 border-t border-b border-white/10 bg-[#050505]">
        <MockInterviewPlatform />
      </section>

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
      <PortfolioProvider>
        <InterviewProvider>
          <MainLayout />
        </InterviewProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}
