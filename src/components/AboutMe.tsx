import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import MaskedHeading from './MaskedHeading';
import { StaggerContainer, StaggerItem } from './StaggerReveal';

const AboutMe: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const { personalInfo } = data;

  return (
    <section
      id="about"
      className={`relative w-full min-h-screen flex flex-col justify-center items-center py-24 px-5 sm:px-8 md:px-12 transition-colors duration-300 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0C0C0C] text-white' : 'bg-white text-slate-900 border-t border-slate-200'
      }`}
    >
      {/* Decorative Ambient Tech Vectors & Glows */}
      <motion.div
        className={`absolute top-[8%] left-[3%] sm:left-[5%] w-28 sm:w-36 h-28 sm:h-36 rounded-full border backdrop-blur-sm flex items-center justify-center pointer-events-none z-0 ${
          theme === 'dark' ? 'border-cyan-500/20 bg-cyan-500/5' : 'border-cyan-500/30 bg-cyan-500/10 shadow-sm'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
      >
        <div className="w-16 h-16 rounded-full border border-dashed border-cyan-500/30" />
        <span className="absolute text-xl opacity-80">☁️</span>
      </motion.div>

      <motion.div
        className={`absolute bottom-[8%] left-[4%] sm:left-[6%] w-24 sm:w-32 h-24 sm:h-32 rounded-2xl border backdrop-blur-sm flex items-center justify-center pointer-events-none z-0 rotate-12 ${
          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100/90 shadow-sm'
        }`}
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div className={`text-center font-mono text-[10px] ${theme === 'dark' ? 'text-white/50' : 'text-slate-500'}`}>
          <span className="text-cyan-400 block font-bold text-sm">99.9%</span>
          UPTIME
        </div>
      </motion.div>

      <motion.div
        className={`absolute top-[10%] right-[3%] sm:right-[5%] w-28 sm:w-36 h-28 sm:h-36 rounded-full border backdrop-blur-sm flex items-center justify-center pointer-events-none z-0 ${
          theme === 'dark' ? 'border-blue-500/20 bg-blue-500/5' : 'border-blue-500/30 bg-blue-500/10 shadow-sm'
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <div className="w-20 h-20 rounded-full border border-dotted border-blue-500/40" />
        <span className="absolute text-xl opacity-80">⚡</span>
      </motion.div>

      <motion.div
        className={`absolute bottom-[6%] right-[4%] sm:right-[6%] w-28 sm:w-40 h-24 sm:h-28 rounded-2xl border backdrop-blur-sm flex flex-col justify-center p-3 pointer-events-none z-0 -rotate-6 ${
          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100/90 shadow-sm'
        }`}
        initial={{ x: 40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className={`font-mono text-[10px] ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>OBSERVABILITY</span>
        </div>
        <div className="flex gap-1 items-end h-6">
          <div className="w-2 h-3 bg-cyan-500/60 rounded-t" />
          <div className="w-2 h-5 bg-cyan-400 rounded-t" />
          <div className="w-2 h-4 bg-blue-500/80 rounded-t" />
          <div className={`w-2 h-6 rounded-t ${theme === 'dark' ? 'bg-white/80' : 'bg-slate-700'}`} />
          <div className="w-2 h-5 bg-cyan-400 rounded-t" />
        </div>
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 w-full max-w-4xl text-center"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-6 shadow-sm backdrop-blur-md uppercase tracking-[0.25em] border transition-colors ${
          theme === 'dark'
            ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
            : 'border-cyan-200 text-cyan-800 bg-cyan-50'
        }`}>
          ✦ Professional Summary
        </div>

        <MaskedHeading
          text="ABOUT ME"
          as="h2"
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-black leading-tight tracking-tight mb-8 font-['Syne',sans-serif] uppercase transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}
        />

        {/* Word-for-word Summary from Resume */}
        <p className={`text-base sm:text-lg md:text-xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed max-w-3xl mx-auto mb-10 text-justify sm:text-center transition-colors ${
          theme === 'dark' ? 'text-white/90' : 'text-slate-700'
        }`}>
          {personalInfo.summary}
        </p>

        {/* Core Competencies Badges with Staggered Entrance */}
        <StaggerContainer
          className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-12"
          staggerDelay={0.06}
          delayChildren={0.1}
          viewportAmount={0.2}
        >
          {[
            'AWS Cloud Infrastructure',
            'Terraform IaC',
            'Prometheus & Grafana',
            'Jenkins CI/CD',
            'Node Exporter & PromQL',
            'Alertmanager & SRE',
            'AWS Well-Architected Framework',
            'Incident Response & MTTD Reduction',
          ].map((badge) => (
            <StaggerItem
              key={badge}
              direction="up"
              customDistance={18}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-['Space_Grotesk',sans-serif] font-medium backdrop-blur-md border transition-colors duration-300 cursor-default ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/15 text-white/90 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-cyan-400 hover:text-cyan-700 shadow-sm'
              }`}
            >
              {badge}
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Buttons Row */}
        <div className="flex flex-row justify-center items-center gap-4 sm:gap-8 font-['Outfit',sans-serif]">
          <motion.a
            href="#experience"
            className={`flex items-center gap-3 px-7 py-3.5 rounded-[30px] font-bold text-base md:text-lg transition-transform ${
              theme === 'dark'
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                : 'bg-slate-900 text-white shadow-[0_4px_15px_rgba(15,23,42,0.2)]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              theme === 'dark' ? 'bg-black text-white' : 'bg-white text-slate-900'
            }`}>
              →
            </span>
            Experience
          </motion.a>

          <motion.button
            onClick={async () => {
              const { downloadResumePdf } = await import('../utils/generateResumePdf');
              downloadResumePdf('Saivinod_Kotipalli_Resume.pdf');
            }}
            className={`flex items-center gap-3 px-7 py-3.5 rounded-[30px] border font-bold text-base md:text-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-white/30 bg-black/40 text-white hover:bg-white hover:text-black'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-900 hover:text-white shadow-sm'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Resume
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;
