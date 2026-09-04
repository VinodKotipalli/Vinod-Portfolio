import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { ProjectItem } from '../data/portfolioData';
import { ExternalLink, X, CheckCircle2, Layers, Cpu, ShieldCheck } from 'lucide-react';
import MotionCard from './MotionCard';
import MaskedHeading from './MaskedHeading';
import { StaggerContainer, StaggerItem } from './StaggerReveal';

export const Projects: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const projects = data.projects;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section
      id="projects"
      className={`pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#050505] border-white/10 text-white'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 text-center md:text-left"
        >
          <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
            theme === 'dark'
              ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
              : 'border-cyan-200 text-cyan-800 bg-cyan-50'
          }`}>
            ✦ Technical Projects
          </div>
          <MaskedHeading
            text="FEATURED PROJECTS"
            as="h2"
            className={`text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight uppercase font-['Syne',sans-serif] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}
          />
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}>
            Production AWS multi-tier infrastructure, Amazon EKS Kubernetes orchestration, GitHub Actions CI/CD automation, Terraform remote state management, and full-stack observability.
          </p>
        </motion.div>

        {/* 5 Square Projects Grid with Sequential Staggered Entrance */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.1}
          viewportAmount={0.12}
        >
          {projects.map((project) => {
            return (
              <StaggerItem
                key={project.title}
                direction="up"
                customDistance={32}
                whileHover={{ y: -6 }}
                className="aspect-square"
              >
                <MotionCard
                  onClick={() => setSelectedProject(project)}
                  glowColor={theme === 'dark' ? 'rgba(6, 182, 212, 0.28)' : 'rgba(2, 132, 199, 0.16)'}
                  className={`w-full h-full backdrop-blur-md border rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 hover:border-cyan-400/60 hover:bg-white/[0.08]'
                      : 'bg-white border-slate-200 hover:border-cyan-500/60 hover:shadow-md'
                  }`}
                >
                  {/* Subtle top corner accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/15 to-transparent pointer-events-none rounded-tr-3xl" />

                  {/* Top Section: Category & Status */}
                  <div>
                    <div className={`flex items-center justify-between gap-2 mb-3 pb-3 border-b ${
                      theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                    }`}>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider truncate max-w-[170px] border ${
                        theme === 'dark'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                      }`}>
                        {project.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-['JetBrains_Mono',monospace] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Production Ready
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className={`text-base sm:text-lg font-bold group-hover:text-cyan-400 transition-colors leading-snug font-['Outfit',sans-serif] mb-1.5 line-clamp-2 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-cyan-700'
                    }`}>
                      {project.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`text-[11px] font-['Plus_Jakarta_Sans',sans-serif] mb-3 line-clamp-1 ${
                      theme === 'dark' ? 'text-white/60' : 'text-slate-500'
                    }`}>
                      {project.subtitle}
                    </p>

                    {/* Concise Description */}
                    <p className={`text-xs font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed line-clamp-3 mb-3 ${
                      theme === 'dark' ? 'text-white/75' : 'text-slate-600'
                    }`}>
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Section: Tech Stack & Trigger Button */}
                  <div className={`pt-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono',monospace] transition-all border ${
                            theme === 'dark'
                              ? 'bg-black/60 border-white/10 text-white/90 group-hover:border-white/20'
                              : 'bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono',monospace] border ${
                          theme === 'dark'
                            ? 'bg-white/5 border-white/10 text-white/50'
                            : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Open Details Link with Animated Arrow */}
                    <div className="flex items-center justify-between text-xs font-['JetBrains_Mono',monospace] font-bold text-cyan-400 dark:text-cyan-300 group-hover:text-cyan-300 dark:group-hover:text-white transition-colors">
                      <span className={theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}>View Architecture Details</span>
                      <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-cyan-500 group-hover:border-cyan-500 flex items-center justify-center text-slate-900 dark:text-white transition-all text-xs group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </div>
                  </div>
                </MotionCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Interactive Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative ${
                theme === 'dark'
                  ? 'bg-[#0e0e0e] border-white/15 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className={`absolute top-6 right-6 w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-['JetBrains_Mono',monospace] font-bold border uppercase tracking-wider ${
                theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-cyan-50 text-cyan-800 border-cyan-200'
              }`}>
                {selectedProject.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-['JetBrains_Mono',monospace] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Production Architecture
              </span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-black font-['Outfit',sans-serif] mb-2 pr-8 ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}>
              {selectedProject.title}
            </h3>
            <p className={`text-sm font-['Plus_Jakarta_Sans',sans-serif] mb-5 ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>
              {selectedProject.subtitle}
            </p>

            {/* Description */}
            <div className={`mb-6 p-4 rounded-2xl border ${
              theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <h4 className={`text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider mb-2 ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-800'
              }`}>
                Overview & Design Purpose
              </h4>
              <p className={`text-sm font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed ${
                theme === 'dark' ? 'text-white/80' : 'text-slate-700'
              }`}>
                {selectedProject.description}
              </p>
            </div>

            {/* Key Deliverables & Architecture Highlights */}
            <div className="mb-6">
              <h4 className={`text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
              }`}>
                Key Architecture Deliverables ({selectedProject.highlights.length} Points)
              </h4>
              <div className="space-y-2.5">
                {selectedProject.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className={`text-xs sm:text-sm font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed ${
                      theme === 'dark' ? 'text-white/85' : 'text-slate-700'
                    }`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
              <h4 className={`text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider mb-3 ${
                theme === 'dark' ? 'text-white/90' : 'text-slate-800'
              }`}>
                Technologies & Tools Applied
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`px-3 py-1 rounded-lg border text-xs font-['JetBrains_Mono',monospace] font-medium ${
                      theme === 'dark'
                        ? 'bg-white/10 border-white/15 text-white'
                        : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* GitHub Link Action */}
              <div className={`flex flex-col sm:flex-row gap-3 pt-3 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-200'
              }`}>
                <a
                  href={data.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>Explore Source Code on GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  );
};

export default Projects;

