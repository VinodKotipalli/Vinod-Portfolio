import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const SkillCategoryCard: React.FC<{ category: SkillCategory; index: number }> = ({ category, index }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={index * 100}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#ff2a2a]/40 hover:shadow-[0_20px_50px_rgba(255,42,42,0.1)] transition-all duration-500 group"
  >
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
      <h3 className="text-white text-xl font-black tracking-tight group-hover:text-[#ff2a2a] transition-colors">
        {category.title}
      </h3>
      <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-wider">
        0{index + 1}
      </span>
    </div>

    <div className="space-y-5">
      {category.skills.map((skill) => (
        <div key={skill.name}>
          <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
            <span className="text-white/90">{skill.name}</span>
            <span className="text-white/50 font-mono">{skill.level}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-[#ff2a2a] rounded-full transition-all duration-1000 ease-out group-hover:brightness-125"
              style={{ width: `${skill.level}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TechnicalSkills: React.FC = () => {
  const { data } = usePortfolio();
  const categories = data.technicalSkills.categories;
  return (
    <section
      id="skills"
      className="bg-[#0a0a0a] pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:80px_80px]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 md:mb-20 text-center md:text-left">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-sm text-white/60 font-bold mb-6 shadow-sm bg-white/5 backdrop-blur-sm">
            Technical Stack
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight uppercase">
            Languages, Frameworks & Tools
          </h2>
          <p className="text-white/60 text-base md:text-lg max-w-xl font-medium leading-relaxed">
            A comprehensive set of modern full-stack development skills engineered for production-ready web applications.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <SkillCategoryCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
