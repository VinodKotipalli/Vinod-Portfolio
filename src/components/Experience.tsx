import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const { experience, achievements } = data;

  return (
    <section
      id="experience"
      className="bg-[#0c0c0c] text-white pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/10"
    >
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-16 text-center md:text-left">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/70 font-bold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-widest">
            Career History
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight uppercase font-['Kanit',sans-serif]">
            PROFESSIONAL EXPERIENCE
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
            Enterprise cloud operations experience building high-availability monitoring platforms and automated pipelines.
          </p>
        </div>

        {/* Experience Card */}
        <div
          data-aos="fade-up"
          className="bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 md:p-10 hover:border-[#ff2a2a]/40 transition-all duration-500 shadow-2xl mb-20"
        >
          {/* Company & Role Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#ff2a2a]/20 text-[#ff2a2a] border border-[#ff2a2a]/30 text-xs font-mono font-bold uppercase tracking-wider">
                  Full-Time Role
                </span>
                <span className="text-xs font-mono text-white/60">
                  📍 {experience.location}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-['Kanit',sans-serif]">
                {experience.role}
              </h3>
              <p className="text-lg sm:text-xl font-medium text-white/80 mt-1">
                {experience.company}
              </p>
            </div>

            <div className="md:text-right shrink-0">
              <span className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold text-white tracking-wide">
                🗓️ {experience.duration}
              </span>
            </div>
          </div>

          {/* 10 Responsibilities and Achievements Points */}
          <div className="space-y-4">
            <h4 className="text-sm font-mono font-bold uppercase tracking-widest text-[#ff2a2a] mb-4">
              Key Responsibilities & Deliverables:
            </h4>
            <div className="grid grid-cols-1 gap-3.5">
              {experience.highlights.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-black/40 border border-white/5 hover:border-white/15 transition-all group"
                >
                  <span className="text-xs font-mono font-bold bg-[#ff2a2a] text-white w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-white/85 text-xs sm:text-sm md:text-base font-light leading-relaxed group-hover:text-white transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Achievements Sub-Section */}
        <div id="achievements" className="pt-8">
          <div data-aos="fade-up" className="mb-12 text-center md:text-left">
            <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/70 font-bold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-widest">
              Impact & Metrics
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight uppercase font-['Kanit',sans-serif]">
              KEY ACHIEVEMENTS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((item, index) => (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#ff2a2a]/50 hover:bg-white/[0.08] transition-all duration-300 group"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-red-200 to-[#ff2a2a] mb-3 font-mono">
                    {item.metric}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-3 tracking-tight group-hover:text-[#ff2a2a] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
                  <span>ACHIEVEMENT 0{index + 1}</span>
                  <span>✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
