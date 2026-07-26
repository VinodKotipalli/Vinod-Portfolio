import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import AdminDashboard from './components/Admin/AdminDashboard';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import TechnicalSkills from './components/TechnicalSkills';
import Services from './components/Services';
import Projects from './components/Projects';
import ContentCreator from './components/ContentCreator';
import Internships from './components/Internships';
import Leadership from './components/Leadership';
import Certificates from './components/Certificates';
import SoftSkills from './components/SoftSkills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Shield } from 'lucide-react';

function MainLayout() {
  const { setIsAdminOpen } = usePortfolio();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ff2a2a] selection:text-white relative">
      <Preloader />
      <Navbar />
      <Hero />
      <About />
      <TechnicalSkills />
      <Services />
      <Projects />
      <ContentCreator />
      <Internships />
      <Leadership />
      <Certificates />
      <SoftSkills />
      <Contact />
      <Footer />

      {/* Admin Quick Launch Floating Button */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-zinc-900/90 hover:bg-[#ff2a2a] text-white p-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/20 hover:border-[#ff2a2a] transition-all duration-300 group flex items-center gap-2"
        title="Open Admin Dashboard"
        aria-label="Admin Dashboard"
      >
        <Shield className="w-5 h-5 text-[#ff2a2a] group-hover:text-white transition-colors" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap">
          Admin Panel
        </span>
      </button>

      {/* Admin Dashboard Drawer/Modal */}
      <AdminDashboard />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainLayout />
    </PortfolioProvider>
  );
}
