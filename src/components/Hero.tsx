import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { heroContent, personalInfo, socialLinks } = data;

  return (
    <section className="relative w-full min-h-screen bg-[#000000] overflow-hidden flex flex-col justify-between pt-28 pb-12">
      {/* Background Gradients & Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-red-900/10 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/80 to-black z-10" />
      </div>

      {/* Social Sidebar (Desktop) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-6">
        <div className="w-[1px] h-16 bg-white/20" />
        <a
          href={socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-[#0077b5] hover:scale-125 transition-all duration-300"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a
          href={socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 hover:text-white hover:scale-125 transition-all duration-300"
          aria-label="GitHub"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
        <div className="w-[1px] h-16 bg-white/20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 px-6 md:px-12 max-w-6xl mx-auto flex flex-col items-start text-left w-full my-auto">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold tracking-wider text-[#ff2a2a] uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping" />
            {personalInfo.title}
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            📍 {personalInfo.location}
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-white text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.08] font-['Kanit',sans-serif]">
          {personalInfo.name.toUpperCase()} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#ff2a2a]">
            {personalInfo.title}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-base sm:text-lg md:text-xl font-light mb-8 max-w-3xl leading-relaxed">
          {heroContent.subtitle}
        </p>

        {/* Contact Info Pills */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-white/70 mb-10 pb-6 border-b border-white/10 w-full">
          <a
            href={`mailto:${personalInfo.email}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-3.5 py-2 rounded-lg border border-white/10"
          >
            ✉️ {personalInfo.email}
          </a>
          <a
            href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-3.5 py-2 rounded-lg border border-white/10"
          >
            📞 {personalInfo.phone}
          </a>
          <span className="flex items-center gap-2 bg-white/5 px-3.5 py-2 rounded-lg border border-white/10">
            🏢 TCS (June 2024 – June 2026)
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-row flex-wrap items-center gap-4">
          <a
            href={heroContent.ctaPrimary.href}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(255,255,255,0.3)] flex items-center gap-2"
          >
            <span>{heroContent.ctaPrimary.text}</span>
            <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
              ↓
            </span>
          </a>

          <a
            href={heroContent.ctaSecondary.href}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-[#ff2a2a] text-white font-bold hover:bg-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.4)]"
          >
            {heroContent.ctaSecondary.text}
          </a>

          <a
            href={heroContent.ctaResume.href}
            download
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-black/60 border border-white/40 text-white font-bold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {heroContent.ctaResume.text}
          </a>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-20 flex justify-center mt-6">
        <a href="#about" className="animate-bounce text-white/50 hover:text-white transition-colors" aria-label="Scroll to About section">
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7 7m7-7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
