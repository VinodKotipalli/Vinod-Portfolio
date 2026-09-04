import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedCounter from './AnimatedCounter';
import MotionCard from './MotionCard';
import MaskedHeading from './MaskedHeading';
import { StaggerContainer, StaggerItem } from './StaggerReveal';

const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const { experience, achievements } = data;

  return (
    <section
      id="experience"
      className={`pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0c0c0c] text-white border-white/10'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 text-center md:text-left"
        >
          <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
            theme === 'dark'
              ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
              : 'border-cyan-200 text-cyan-800 bg-cyan-50'
          }`}>
            ✦ Career History
          </div>
          <MaskedHeading
            text="PROFESSIONAL EXPERIENCE"
            as="h2"
            className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}
          />
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}>
            Enterprise cloud operations experience building high-availability monitoring platforms and automated pipelines.
          </p>
        </motion.div>

        {/* Experience Card with Scroll-Triggered Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className={`backdrop-blur-md border rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-500 mb-20 ${
            theme === 'dark'
              ? 'bg-white/5 border-white/15 hover:border-cyan-400/40 shadow-2xl'
              : 'bg-slate-50 border-slate-200 hover:border-cyan-500/40 shadow-lg'
          }`}
        >
          {/* Company & Role Header */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b gap-4 ${
            theme === 'dark' ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`px-3.5 py-1 rounded-full text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider border ${
                  theme === 'dark'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                }`}>
                  Full-Time Role
                </span>
                <span className={`text-xs font-['JetBrains_Mono',monospace] ${
                  theme === 'dark' ? 'text-white/60' : 'text-slate-500'
                }`}>
                  📍 {experience.location}
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-['Outfit',sans-serif] ${
                theme === 'dark' ? 'text-white' : 'text-slate-950'
              }`}>
                {experience.role}
              </h3>
              <p className={`text-lg sm:text-xl font-bold mt-1 font-['Space_Grotesk',sans-serif] ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-700'
              }`}>
                {experience.company}
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <span className={`inline-block border px-4 py-2 rounded-xl text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-bold tracking-wide ${
                theme === 'dark'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white border-slate-300 text-slate-800 shadow-sm'
              }`}>
                🗓️ {experience.duration}
              </span>
            </div>
          </div>

          {/* 10 Responsibilities with Progressive Motion Timeline */}
          <div className="relative">
            <h4 className={`text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Key Responsibilities & Deliverables:</span>
            </h4>

            <StaggerContainer className="space-y-3" staggerDelay={0.05} delayChildren={0.05} viewportAmount={0.1}>
              {experience.highlights.map((point, index) => (
                <StaggerItem
                  key={index}
                  direction="right"
                  customDistance={20}
                  whileHover={{ x: 4 }}
                  className={`flex items-start gap-3.5 p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-black/30 border-white/5 hover:border-cyan-500/20'
                      : 'bg-white border-slate-200 hover:border-cyan-300 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-['JetBrains_Mono',monospace] font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {index + 1}
                  </span>
                  <p className={`text-xs sm:text-sm md:text-base font-normal font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
                    theme === 'dark' ? 'text-white/85' : 'text-slate-700'
                  }`}>
                    {point}
                  </p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </motion.div>

        {/* Key Achievements Sub-Section with Animated Counters */}
        <div id="achievements" className="pt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-12 text-center md:text-left"
          >
            <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
              theme === 'dark'
                ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
                : 'border-cyan-200 text-cyan-800 bg-cyan-50'
            }`}>
              ✦ Impact & Metrics
            </div>
            <h3 className={`text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight uppercase font-['Syne',sans-serif] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              KEY ACHIEVEMENTS
            </h3>
          </motion.div>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            staggerDelay={0.12}
            viewportAmount={0.15}
          >
            {achievements.map((item, index) => (
              <StaggerItem
                key={item.title}
                direction="up"
                customDistance={30}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <MotionCard
                  className={`backdrop-blur-md border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 h-full ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] hover:shadow-[0_15px_35px_rgba(6,182,212,0.14)]'
                      : 'bg-slate-50 border-slate-200 hover:border-cyan-500/40 hover:bg-white hover:shadow-md'
                  }`}
                  glowColor={theme === 'dark' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(2, 132, 199, 0.15)'}
                >
                  <div>
                    {/* Animated Number Counter */}
                    <div className={`text-3xl sm:text-4xl font-black font-['Outfit',sans-serif] mb-3 ${
                      theme === 'dark'
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300'
                        : 'text-cyan-700'
                    }`}>
                      <AnimatedCounter text={item.metric} />
                    </div>
                    <h4 className={`font-bold text-lg mb-3 tracking-tight group-hover:text-cyan-400 transition-colors font-['Outfit',sans-serif] ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-cyan-700'
                    }`}>
                      {item.title}
                    </h4>
                    <p className={`text-xs sm:text-sm leading-relaxed font-normal font-['Plus_Jakarta_Sans',sans-serif] ${
                      theme === 'dark' ? 'text-white/70' : 'text-slate-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] ${
                    theme === 'dark' ? 'border-white/10 text-white/40' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span>ACHIEVEMENT 0{index + 1}</span>
                    <span className="group-hover:rotate-12 transition-transform duration-300">✨</span>
                  </div>
                </MotionCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default Experience;
