import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const { data } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const { personalInfo, socialLinks } = data;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Achievements', href: '#achievements' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-black/85 backdrop-blur-xl py-3 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-white/85 backdrop-blur-xl py-3 border-b border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand Name */}
        <a
          href="#"
          className={`text-sm sm:text-base xl:text-lg font-black tracking-wider uppercase flex items-center gap-2.5 group transition-colors whitespace-nowrap shrink-0 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className="bg-gradient-to-tr from-cyan-500 to-blue-600 text-white w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-black text-xs shadow-md shadow-cyan-500/20 shrink-0 group-hover:scale-105 transition-transform">
            SK
          </span>
          <span className="font-['Syne',sans-serif] font-bold tracking-tight whitespace-nowrap">{personalInfo.name}</span>
        </a>

        {/* Desktop Nav Links (xl screens to fit all 8 links comfortably) */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-6 font-['JetBrains_Mono',monospace]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-wider font-medium transition-colors whitespace-nowrap ${
                theme === 'dark'
                  ? 'text-white/70 hover:text-cyan-400'
                  : 'text-slate-600 hover:text-cyan-700'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons & Theme Switcher (xl screens) */}
        <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 font-['Outfit',sans-serif] shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/15 border-white/10 text-cyan-300 hover:text-cyan-200 hover:scale-110 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-950 hover:scale-110 shadow-sm'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-cyan-300" />
            ) : (
              <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-800" />
            )}
          </button>

          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors p-1.5 2xl:p-2 rounded-full ${
              theme === 'dark' ? 'text-white/70 hover:text-[#0077b5]' : 'text-slate-600 hover:text-[#0077b5]'
            }`}
            aria-label="LinkedIn Profile"
          >
            <svg className="w-4.5 h-4.5 2xl:w-5 2xl:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 2xl:p-2 rounded-full transition-all duration-300 flex items-center justify-center group ${
              theme === 'dark'
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-black hover:bg-slate-200/80'
            }`}
            aria-label="GitHub Profile (VinodKotipalli)"
            title="GitHub: VinodKotipalli"
          >
            <svg className="w-4.5 h-4.5 2xl:w-5 2xl:h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="#contact"
            className="px-4 2xl:px-5 py-1.5 2xl:py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] 2xl:text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.35)] whitespace-nowrap shrink-0"
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile / Tablet Actions (Theme Toggle + Hamburger) */}
        <div className="flex items-center gap-3 xl:hidden">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer border ${
              theme === 'dark'
                ? 'bg-white/10 border-white/15 text-cyan-300 hover:bg-white/20'
                : 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-cyan-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg transition-colors focus:outline-none ${
              theme === 'dark' ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-200'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`xl:hidden border-b px-6 py-6 flex flex-col gap-4 backdrop-blur-xl overflow-hidden ${
              theme === 'dark'
                ? 'bg-black/95 border-white/10 text-white'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold uppercase tracking-wider py-1 transition-colors ${
                  theme === 'dark'
                    ? 'text-white/80 hover:text-cyan-400'
                    : 'text-slate-700 hover:text-cyan-600'
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className={`pt-4 border-t flex flex-col gap-3 ${
              theme === 'dark' ? 'border-white/10' : 'border-slate-200'
            }`}>
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className={`px-5 py-2.5 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 border transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 border-white/10 text-cyan-300'
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-cyan-300" /> : <Moon className="w-4 h-4 text-slate-800" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-5 py-2.5 rounded-full font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 border transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub Profile</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm tracking-wider uppercase text-center w-full shadow-[0_0_15px_rgba(6,182,212,0.35)]"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
