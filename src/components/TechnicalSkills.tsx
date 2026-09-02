import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

const categoryIcons: Record<string, string> = {
  'Programming Languages': '💻',
  'Cloud Platforms (AWS – Compute & Storage)': '☁️',
  'AWS Networking': '🌐',
  'AWS Security': '🛡️',
  'Containerization & Orchestration': '📦',
  'Infrastructure as Code (IaC)': '🏗️',
  'Monitoring & Observability': '📊',
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
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center md:text-left">
          <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
            theme === 'dark'
              ? 'border-white/20 text-white/80 bg-white/5'
              : 'border-slate-300 text-slate-800 bg-white'
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

        {/* 12 Categorized Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 hover:border-[#ff2a2a]/50 hover:bg-white/[0.07] hover:shadow-[0_15px_35px_rgba(255,42,42,0.1)]'
                  : 'bg-white border-slate-200 hover:border-[#ff2a2a]/40 hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]'
              }`}
            >
              <div>
                {/* Category Header */}
                <div className={`flex items-start justify-between gap-3 mb-5 pb-3 border-b ${
                  theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{categoryIcons[category.title] || '⚡'}</span>
                    <h3 className={`font-bold text-base md:text-lg tracking-tight group-hover:text-[#ff2a2a] transition-colors leading-snug font-['Outfit',sans-serif] ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
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

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2 font-['Space_Grotesk',sans-serif]">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        theme === 'dark'
                          ? 'bg-black/60 border border-white/10 text-white/90 group-hover:border-white/20 hover:bg-[#ff2a2a]/10 hover:text-white'
                          : 'bg-slate-100 border border-slate-200 text-slate-800 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
