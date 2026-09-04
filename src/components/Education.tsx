import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import MotionCard from './MotionCard';
import MaskedHeading from './MaskedHeading';
import { StaggerContainer, StaggerItem } from './StaggerReveal';

const Education: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const { education } = data;

  return (
    <section
      id="education"
      className={`pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#0c0c0c] text-white border-white/10'
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
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
            ✦ Academic Background
          </div>
          <MaskedHeading
            text="EDUCATION"
            as="h2"
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 uppercase font-['Syne',sans-serif] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}
          />
          <p className={`text-sm sm:text-base md:text-lg max-w-xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}>
            Formal foundations in Computer Science principles, algorithms, operating systems, and software engineering.
          </p>
        </motion.div>

        {/* Education Card with Staggered Entrance */}
        <StaggerContainer
          className="max-w-3xl"
          viewportAmount={0.15}
        >
          <StaggerItem
            direction="up"
            customDistance={32}
            whileHover={{ y: -6 }}
            className="w-full"
          >
            <MotionCard
              className={`backdrop-blur-md border rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/15 hover:border-cyan-400/50 hover:shadow-[0_15px_35px_rgba(6,182,212,0.14)] shadow-xl'
                  : 'bg-white border-slate-200 hover:border-cyan-500/50 hover:shadow-md shadow-md'
              }`}
              glowColor={theme === 'dark' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(2, 132, 199, 0.12)'}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <span className={`text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border ${
                    theme === 'dark'
                      ? 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                      : 'text-cyan-800 bg-cyan-50 border-cyan-200'
                  }`}>
                    Graduation Degree
                  </span>
                  <span className={`text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-bold px-4 py-1.5 rounded-full border ${
                    theme === 'dark'
                      ? 'text-white bg-white/10 border-white/20'
                      : 'text-slate-800 bg-slate-100 border-slate-300'
                  }`}>
                    Score: {education.percentage}
                  </span>
                </div>

                <h3 className={`text-2xl sm:text-3xl font-black mb-2 font-['Outfit',sans-serif] ${
                  theme === 'dark' ? 'text-white' : 'text-slate-950'
                }`}>
                  {education.degree}
                </h3>

                <p className={`text-base sm:text-lg font-bold mb-2 font-['Space_Grotesk',sans-serif] ${
                  theme === 'dark' ? 'text-white/90' : 'text-slate-700'
                }`}>
                  {education.institution} • {education.university}
                </p>

                <p className={`text-xs sm:text-sm font-['JetBrains_Mono',monospace] mb-6 ${
                  theme === 'dark' ? 'text-white/60' : 'text-slate-500'
                }`}>
                  📍 {education.location}
                </p>
              </div>

              <div className={`pt-6 border-t flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] ${
                theme === 'dark' ? 'border-white/10 text-white/70' : 'border-slate-200 text-slate-600'
              }`}>
                <span>Duration: {education.duration}</span>
                <span className="text-emerald-600 dark:text-green-400 font-semibold">✓ Completed</span>
              </div>
            </MotionCard>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Education;
