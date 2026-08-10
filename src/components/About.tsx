import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const About: React.FC = () => {
  const { data } = usePortfolio();
  const { aboutContent, education } = data;

  return (
    <section
      id="about"
      className="bg-white text-black pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Section Header */}
        <div data-aos="fade-up" className="mb-16">
          <div className="inline-block border border-gray-300 rounded-full px-5 py-1.5 text-sm text-gray-700 font-bold mb-6 shadow-sm bg-gray-50">
            About Me
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-6 uppercase">
            {aboutContent.heading}
          </h2>
          <div
            className="text-lg md:text-2xl font-medium text-gray-700 leading-relaxed max-w-4xl"
            dangerouslySetInnerHTML={{ __html: aboutContent.bio }}
          />
        </div>

        {/* Info Grid: Education & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Education Card */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="bg-[#f8f8f8] border border-gray-200 rounded-3xl p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 lg:col-span-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 bg-gray-200/80 px-3 py-1 rounded-full">
                  Education Background
                </span>
                <span className="text-sm font-bold text-[#ff2a2a] bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  CGPA: {education.cgpa}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                {education.degree}
              </h3>
              <p className="text-lg font-bold text-gray-700 mb-6">
                {education.institution} • Graduation {education.graduation}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200/80">
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <span className="text-xs font-mono text-gray-500 uppercase">Class 12th Board</span>
                  <p className="text-base font-bold text-gray-900">{education.twelfth}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200">
                  <span className="text-xs font-mono text-gray-500 uppercase">Class 10th CBSE</span>
                  <p className="text-base font-bold text-gray-900">{education.tenth}</p>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="mt-8 pt-6 border-t border-gray-200/80">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                Primary Specializations:
              </span>
              <div className="flex flex-wrap gap-2">
                {aboutContent.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-black text-white hover:bg-[#ff2a2a] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Card */}
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-[#0a0a0a] text-white rounded-3xl p-8 border border-white/10 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff2a2a] mb-6">
                Key Metrics
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-4xl font-black text-white">10+</span>
                  <p className="text-sm text-white/60 font-medium">Full Stack & Web Projects</p>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div>
                  <span className="text-4xl font-black text-white">8.8</span>
                  <p className="text-sm text-white/60 font-medium">B.Tech Engineering CGPA</p>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div>
                  <span className="text-4xl font-black text-white">50+</span>
                  <p className="text-sm text-white/60 font-medium">Cinematic Edits & Visual Assets</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href="#projects"
                className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[#ff2a2a] hover:text-white transition-colors"
              >
                <span>Explore Showcase</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Star Icons */}
      <div className="absolute top-12 right-12 text-gray-200 animate-pulse pointer-events-none">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5z" />
        </svg>
      </div>
    </section>
  );
};

export default About;
