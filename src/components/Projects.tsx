import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const projects = data.projects;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="projects"
      className="bg-[#050505] pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/10"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-14 text-center md:text-left">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/80 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-[0.25em]">
            ✦ Technical Projects
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif]">
            FEATURED PROJECTS
          </h2>
          <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
            Production AWS multi-tier infrastructure, Amazon EKS Kubernetes orchestration, GitHub Actions CI/CD automation, Terraform remote state management, and full-stack observability.
          </p>
        </div>

        {/* 5 Projects Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, pIndex) => {
            const isExpanded = expandedIndex === pIndex;
            const displayedHighlights = isExpanded ? project.highlights : project.highlights.slice(0, 3);

            return (
              <div
                key={project.title}
                data-aos="fade-up"
                data-aos-delay={pIndex * 80}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#ff2a2a]/40 hover:bg-white/[0.07] hover:shadow-[0_15px_35px_rgba(255,42,42,0.1)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-['JetBrains_Mono',monospace] font-bold bg-[#ff2a2a]/15 text-[#ff5858] border border-[#ff2a2a]/30 uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-['JetBrains_Mono',monospace] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Production Ready
                    </span>
                  </div>

                  {/* Project Title & Subtitle */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#ff2a2a] transition-colors leading-snug font-['Outfit',sans-serif] mb-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-white/60 font-['Plus_Jakarta_Sans',sans-serif] mb-3 leading-relaxed">
                    {project.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-white/80 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="space-y-2 mb-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase text-[#ff5858] tracking-wider block">
                      Key Highlights:
                    </span>
                    {displayedHighlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-white/80 font-['Plus_Jakarta_Sans',sans-serif] leading-snug">
                        <span className="text-[#ff2a2a] font-bold shrink-0 mt-0.5">▸</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expand/Collapse Toggle if more highlights exist */}
                  {project.highlights.length > 3 && (
                    <button
                      onClick={() => toggleExpand(pIndex)}
                      className="text-[11px] font-['JetBrains_Mono',monospace] text-[#ff5858] hover:text-white transition-colors mb-4 flex items-center gap-1 font-semibold"
                    >
                      {isExpanded ? '▲ Show less' : `▼ View all highlights (${project.highlights.length})`}
                    </button>
                  )}
                </div>

                {/* Technologies List */}
                <div className="pt-4 border-t border-white/10 mt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-['JetBrains_Mono',monospace] text-white/90 group-hover:border-white/20 transition-all hover:bg-[#ff2a2a]/10 hover:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
