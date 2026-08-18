import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

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
  const categories = data.technicalSkills;

  return (
    <section
      id="skills"
      className="bg-[#050505] pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/10"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center md:text-left">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/70 font-bold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-widest">
            Skills & Competencies
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight uppercase font-['Kanit',sans-serif]">
            TECHNICAL SKILLS
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
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
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#ff2a2a]/50 hover:bg-white/[0.07] hover:shadow-[0_15px_35px_rgba(255,42,42,0.1)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{categoryIcons[category.title] || '⚡'}</span>
                    <h3 className="text-white font-bold text-base md:text-lg tracking-tight group-hover:text-[#ff2a2a] transition-colors leading-snug">
                      {category.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-white/30 shrink-0">
                    #{index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                </div>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-black/60 border border-white/10 text-white/90 group-hover:border-white/20 transition-colors"
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
