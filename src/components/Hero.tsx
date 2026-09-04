import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { downloadResumePdf } from '../utils/generateResumePdf';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const { personalInfo, heroContent, socialLinks } = data;

  return (
    <section className={`relative min-h-screen flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Dynamic Background with Ambient Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Animated breathing radial gradients */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] ${
            theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-500/12'
          }`}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className={`absolute top-1/3 right-1/4 w-[450px] h-[450px] rounded-full blur-[130px] ${
            theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-600/10'
          }`}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className={`absolute inset-0 ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.04]'}`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${theme === 'dark' ? 'white' : '#0f172a'} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Large Decorative Text Outline with continuous slow drift */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' ? 0.08 : 0.12 }}
          transition={{ duration: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none text-center w-full overflow-hidden"
        >
          <span className="text-[12vw] font-black tracking-tighter text-transparent stroke-text uppercase whitespace-nowrap">
            DEVOPS • CLOUD • SRE
          </span>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col items-start justify-center flex-grow w-full"
      >
        {/* Top Badges & Floating Micro-Chips */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
          {/* Badge 1: Role Badge with Pulse */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-colors ${
            theme === 'dark'
              ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
              : 'bg-cyan-50 border border-cyan-200 shadow-sm'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDuration: '2s' }} />
            <span className={`text-xs font-['JetBrains_Mono',monospace] font-bold tracking-wider uppercase ${
              theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
            }`}>
              AWS CLOUD OPERATIONS ENGINEER
            </span>
          </div>

          {/* Badge 2: Location Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-colors ${
            theme === 'dark'
              ? 'bg-white/[0.04] border border-white/10 text-white/70'
              : 'bg-white border border-slate-200 text-slate-700 shadow-sm'
          }`}>
            <span className="text-xs">📍</span>
            <span className="text-xs font-['JetBrains_Mono',monospace] tracking-wide font-medium">
              {personalInfo.location}
            </span>
          </div>
        </motion.div>

        {/* Hero Title & Identity with Staggered Entrance */}
        <div className="mb-8 w-full">
          {/* Candidate Name - Large Expanded Typography */}
          <motion.h1
            variants={itemVariants}
            className={`text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-black tracking-wider uppercase font-['Syne',sans-serif] mb-6 sm:mb-8 leading-none transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}
          >
            {personalInfo.name}
          </motion.h1>

          {/* Attached Role Title with RGB Colors & Motion */}
          <motion.div
            variants={itemVariants}
            className="font-['Outfit',sans-serif] font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.05] tracking-tight"
          >
            <div className="mb-1">
              <span className={`text-rgb-motion ${
                theme === 'dark'
                  ? 'drop-shadow-[0_0_35px_rgba(0,245,255,0.35)]'
                  : 'drop-shadow-[0_0_20px_rgba(0,180,216,0.3)]'
              }`}>
                AWS Cloud
              </span>
            </div>
            <div>
              <span className={`text-rgb-motion ${
                theme === 'dark'
                  ? 'drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]'
                  : 'drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              }`}>
                Operations Engineer
              </span>
            </div>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className={`text-base sm:text-lg md:text-xl font-light mb-8 max-w-3xl leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/80' : 'text-slate-700'
          }`}
        >
          {heroContent.subtitle}
        </motion.p>

        {/* Contact Info Pills with Hover Spring */}
        <motion.div
          variants={itemVariants}
          className={`flex flex-wrap gap-4 text-xs font-mono mb-10 pb-6 border-b w-full transition-colors ${
            theme === 'dark' ? 'text-white/70 border-white/10' : 'text-slate-700 border-slate-200'
          }`}
        >
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`mailto:${personalInfo.email}`}
            className={`flex items-center gap-2 transition-colors px-3.5 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/15 border-white/10 text-white/80 hover:text-white hover:border-cyan-400/40'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 shadow-sm'
            }`}
          >
            ✉️ {personalInfo.email}
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
            className={`flex items-center gap-2 transition-colors px-3.5 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/15 border-white/10 text-white/80 hover:text-white hover:border-cyan-400/40'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 shadow-sm'
            }`}
          >
            📞 {personalInfo.phone}
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 transition-colors px-3.5 py-2 rounded-lg border group cursor-pointer ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/15 border-white/10 text-white/80 hover:text-white hover:border-cyan-400/40'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800 hover:text-slate-950 shadow-sm'
            }`}
            title="GitHub: VinodKotipalli"
          >
            <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white/80 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-950'}`} fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub Profile</span>
          </motion.a>
          <span className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border ${
            theme === 'dark' ? 'bg-white/5 border-white/10 text-white/80' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}>
            🏢 TCS (June 2024 – Present)
          </span>
        </motion.div>

        {/* CTA Buttons with Spring Motion */}
        <motion.div variants={itemVariants} className="flex flex-row flex-wrap items-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            href={heroContent.ctaPrimary.href}
            className={`px-7 py-3.5 text-sm md:text-base rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_25px_rgba(255,255,255,0.3)]'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_4px_15px_rgba(15,23,42,0.2)]'
            }`}
          >
            <span>{heroContent.ctaPrimary.text}</span>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'
            }`}>
              ↓
            </span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            href={heroContent.ctaSecondary.href}
            className="px-7 py-3.5 text-sm md:text-base rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]"
          >
            {heroContent.ctaSecondary.text}
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => downloadResumePdf('Saivinod_Kotipalli_Resume.pdf')}
            className={`px-7 py-3.5 text-sm md:text-base rounded-full font-bold transition-all duration-300 backdrop-blur-md flex items-center gap-2 cursor-pointer border ${
              theme === 'dark'
                ? 'bg-black/60 border-white/40 text-white hover:bg-white hover:text-black shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white shadow-md'
            }`}
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
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator with floating animation */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-20 flex justify-center mt-6"
      >
        <a
          href="#about"
          className={`animate-bounce transition-colors p-2 rounded-full ${
            theme === 'dark' ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-800'
          }`}
          aria-label="Scroll to About section"
        >
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7 7m7-7V3" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
