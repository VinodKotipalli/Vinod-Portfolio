import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import MotionCard from './MotionCard';

const categoryIcons: Record<string, string> = {
  'Languages': '💻',
  'Programming Languages': '💻',
  'AWS Compute & Storage': '☁️',
  'Cloud Platforms (AWS – Compute & Storage)': '☁️',
  'AWS Networking': '🌐',
  'AWS Security': '🛡️',
  'Containers & Orchestration': '📦',
  'Containerization & Orchestration': '📦',
  'Infrastructure as Code': '🏗️',
  'Infrastructure as Code (IaC)': '🏗️',
  'Monitoring & Observability': '📊',
  'CI/CD & Version Control': '🔄',
  'Configuration Management': '⚙️',
  'Version Control & CI/CD': '🔄',
  'Databases': '🗄️',
  'Operating Systems': '🐧',
  'Methodologies': '🚀',
};

const TechnicalSkills: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const categories = data.technicalSkills;

  return (
    <section
      id="skills"
      className={`pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#050505] border-white/10 text-white'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center md:text-left">
          <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
            theme === 'dark'
              ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
              : 'border-cyan-200 text-cyan-800 bg-cyan-50'
          }`}>
            ✦ Skills & Competencies
          </div>
          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif] transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-slate-950'
          }`}>
            TECHNICAL SKILLS
          </h2>
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}>
            Enterprise cloud operations, automated CI/CD pipelines, container orchestration, and comprehensive AWS infrastructure tools.
          </p>
        </div>

        {/* 11-12 Categorized Skills Grid with Motion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              data-aos="fade-up"
              data-aos-delay={index * 40}
              className="h-full"
            >
              <MotionCard
                className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 h-full ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] hover:shadow-[0_15px_35px_rgba(6,182,212,0.12)]'
                    : 'bg-white border-slate-200 hover:border-cyan-500/40 hover:bg-white hover:shadow-md'
                }`}
                glowColor={theme === 'dark' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(2, 132, 199, 0.14)'}
              >
                <div>
                  {/* Category Header */}
                  <div className={`flex items-start justify-between gap-3 mb-5 pb-3 border-b ${
                    theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                        {categoryIcons[category.title] || '⚡'}
                      </span>
                      <h3 className={`font-bold text-base md:text-lg tracking-tight group-hover:text-cyan-400 transition-colors leading-snug font-['Outfit',sans-serif] ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-cyan-600'
                      }`}>
                        {category.title}
                      </h3>
                    </div>
                    <span className={`text-xs font-['JetBrains_Mono',monospace] font-bold shrink-0 ${
                      theme === 'dark' ? 'text-white/40' : 'text-slate-400'
                    }`}>
                      #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>

                  {/* Skill Pills with Spring Hover Motion */}
                  <div className="flex flex-wrap gap-2 font-['Space_Grotesk',sans-serif]">
                    {category.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.06, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-default transition-colors duration-200 ${
                          theme === 'dark'
                            ? 'bg-black/60 border border-white/10 text-white/90 group-hover:border-white/20 hover:bg-cyan-500/15 hover:text-cyan-300 hover:border-cyan-500/40'
                            : 'bg-slate-100 border border-slate-200 text-slate-800 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-200'
                        }`}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </MotionCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
