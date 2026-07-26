import React from 'react';
import { projects, Project } from '../data/portfolioData';

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={index * 150}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:scale-[1.02] hover:border-[#ff2a2a]/40 hover:shadow-[0_20px_50px_rgba(255,42,42,0.12)] transition-all duration-500 group flex flex-col justify-between"
  >
    <div>
      <div className="flex justify-between items-start mb-6">
        <span className="text-white/40 text-xs font-mono font-bold tracking-widest uppercase">
          {project.number}
        </span>
        {project.badge && (
          <span className="bg-[#ff2a2a]/20 text-[#ff2a2a] text-[10px] font-black tracking-widest uppercase py-1 px-3 rounded-full border border-[#ff2a2a]/30">
            {project.badge}
          </span>
        )}
      </div>

      <h3 className="text-white text-2xl font-black mb-3 tracking-tight group-hover:text-[#ff2a2a] transition-colors">
        {project.title}
      </h3>

      <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6 font-medium">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.techTags.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 text-xs font-mono font-bold text-white/80 bg-white/5 rounded-full border border-white/10"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>

    {/* Project Links */}
    <div className="pt-4 border-t border-white/10 flex items-center gap-4">
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-bold uppercase tracking-wider text-white/80 hover:text-[#ff2a2a] transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>          Code Repo
        </a>
      )}

      {(project.links.demo || project.links.frontendDemo) && (
        <a
          href={(project.links.demo || project.links.frontendDemo)!}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#ff2a2a] hover:bg-red-600 px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ml-auto"
        >
          Live Demo
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      )}
    </div>
  </div>
);

const Projects: React.FC = () => {
  const flagship = projects.find((p) => p.isFlagship) || projects[0];
  const regularProjects = projects.filter((p) => !p.isFlagship);

  return (
    <section
      id="projects"
      className="bg-[#0a0a0a] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-sm text-white/60 font-bold mb-6 shadow-sm bg-white/5 backdrop-blur-sm">
            Work & Applications
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight uppercase">
            Featured Projects
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-xl font-medium leading-relaxed">
            A selection of software engineering platforms, SaaS tools, and web applications I have designed and deployed.
          </p>
        </div>

        {/* Flagship Hero Card */}
        {flagship && (
          <div
            data-aos="fade-up"
            className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group hover:border-[#ff2a2a]/60 hover:shadow-[0_25px_60px_rgba(255,42,42,0.18)] transition-all duration-700"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="text-[#ff2a2a] text-xs font-mono font-bold tracking-widest uppercase bg-[#ff2a2a]/20 border border-[#ff2a2a]/30 px-4 py-1.5 rounded-full">
                {flagship.badge || '🚀 Flagship Project'}
              </span>
              <span className="text-white/40 text-sm font-mono font-bold">
                {flagship.number}
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight group-hover:text-[#ff2a2a] transition-colors">
              {flagship.title}
            </h3>

            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-3xl font-medium">
              {flagship.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-10">
              {flagship.techTags.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-1.5 text-xs md:text-sm font-mono font-bold text-white bg-white/10 rounded-full border border-white/15"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              {flagship.links.github && (
                <a
                  href={flagship.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>                  View Source Code
                </a>
              )}

              {flagship.links.demo && (
                <a
                  href={flagship.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#ff2a2a] hover:bg-red-600 text-white font-bold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,42,42,0.4)]"
                >
                  Live Demo Application
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Regular Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {regularProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
