import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { downloadResumePdf } from '../utils/generateResumePdf';

const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo, heroContent, socialLinks } = data;

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Subtle radial gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#ff2a2a]/10 rounded-full blur-[140px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Large Decorative Text Outline */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none text-center w-full overflow-hidden opacity-10">
          <span className="text-[12vw] font-black tracking-tighter text-transparent stroke-text uppercase whitespace-nowrap">
            DEVOPS • CLOUD • SRE
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col items-start justify-center flex-grow w-full">
        {/* Top Badges matching reference style */}
        <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          {/* Badge 1: Role Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b3b]" />
            <span className="text-[#ff4d4d] text-xs font-['JetBrains_Mono',monospace] font-bold tracking-wider uppercase">
              AWS CLOUD OPERATIONS ENGINEER
            </span>
          </div>

          {/* Badge 2: Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <span className="text-xs">📍</span>
            <span className="text-white/70 text-xs font-['JetBrains_Mono',monospace] tracking-wide">
              {personalInfo.location}
            </span>
          </div>
        </div>

        {/* Hero Title & Identity */}
        <div className="mb-8 w-full">
          {/* Candidate Name - Large Expanded Typography */}
          <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black tracking-wider uppercase font-['Syne',sans-serif] mb-6 sm:mb-8 text-white leading-none">
            {personalInfo.name}
          </h1>

          {/* Attached Role Title in Exact Dual-Tone Style */}
          <div className="font-['Outfit',sans-serif] font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.05] tracking-tight">
            <div className="text-white mb-1">
              AWS Cloud
            </div>
            <div className="text-[#ff5858]">
              Operations Engineer
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-white/80 text-base sm:text-lg md:text-xl font-light mb-8 max-w-3xl leading-relaxed">
          {heroContent.subtitle}
        </p>

        {/* Contact Info Pills */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-white/70 mb-10 pb-6 border-b border-white/10 w-full">
          <a
            href={`mailto:${personalInfo.email}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/15 px-3.5 py-2 rounded-lg border border-white/10"
          >
            ✉️ {personalInfo.email}
          </a>
          <a
            href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
            className="hover:text-white flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/15 px-3.5 py-2 rounded-lg border border-white/10"
          >
            📞 {personalInfo.phone}
          </a>
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-2 transition-colors bg-white/5 hover:bg-white/15 px-3.5 py-2 rounded-lg border border-white/10 group cursor-pointer"
            title="GitHub: VinodKotipalli"
          >
            <svg className="w-4 h-4 text-white/80 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub Profile</span>
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

          <button
            onClick={() => downloadResumePdf('Saivinod_Kotipalli_Resume.pdf')}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-black/60 border border-white/40 text-white font-bold hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{heroContent.ctaResume.text}</span>
          </button>
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
