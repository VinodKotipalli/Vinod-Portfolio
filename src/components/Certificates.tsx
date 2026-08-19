import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../data/portfolioData';

const getIssuerCategory = (issuer: string) => {
  const lower = issuer.toLowerCase();
  if (lower.includes('amazon') || lower.includes('aws')) return 'AWS';
  if (lower.includes('microsoft')) return 'Microsoft Azure';
  if (lower.includes('anthropic') || lower.includes('claude')) return 'Anthropic Claude';
  if (lower.includes('github')) return 'GitHub';
  return 'Cloud & AI';
};

const CertificateCard: React.FC<{ cert: CertificateItem; index: number }> = ({ cert, index }) => {
  const issuerCat = getIssuerCategory(cert.issuer);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={String(Math.min((index % 6) * 80, 400))}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#ff2a2a]/50 hover:bg-white/[0.08] hover:shadow-[0_15px_35px_rgba(255,42,42,0.12)] transition-all duration-300 group flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Icon, Code Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-2.5 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
              {cert.icon}
            </div>
            <div>
              <span className="text-[11px] font-['Space_Grotesk',sans-serif] font-bold text-white/90 block">
                {cert.issuer}
              </span>
              <span className="text-[10px] font-['JetBrains_Mono',monospace] text-white/50">
                {cert.issueDate ? `Issued ${cert.issueDate}` : cert.year}
                {cert.expiryDate ? ` · Exp ${cert.expiryDate}` : ''}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#ff2a2a]/15 border border-[#ff2a2a]/30 text-[#ff5858] text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider shrink-0">
            {cert.code}
          </span>
        </div>

        {/* Certificate Title */}
        <h3 className="text-white font-bold text-base sm:text-lg tracking-tight group-hover:text-[#ff2a2a] transition-colors leading-snug mb-2 font-['Outfit',sans-serif]">
          {cert.name}
        </h3>

        {/* Description */}
        {cert.description && (
          <p className="text-xs text-white/70 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed mb-3">
            {cert.description}
          </p>
        )}

        {/* Skills Chips */}
        {cert.skills && cert.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 pt-2 border-t border-white/5">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded bg-black/50 border border-white/10 text-[9px] font-['JetBrains_Mono',monospace] text-white/80"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Verification Badge */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-['JetBrains_Mono',monospace] text-white/50">
        <span className="flex items-center gap-1.5 text-[10px] text-white/70">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Verified Credential
        </span>

        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold shrink-0">
          {issuerCat}
        </span>
      </div>
    </div>
  );
};

export const Certificates: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certificates;
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterOptions = ['All', 'AWS', 'Microsoft Azure', 'Anthropic Claude', 'GitHub'];

  const filteredCerts = certs.filter((cert) => {
    if (activeFilter === 'All') return true;
    const cat = getIssuerCategory(cert.issuer);
    return cat === activeFilter;
  });

  return (
    <section
      id="certifications"
      className="bg-[#080808] text-white pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/10"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/80 font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-[0.25em]">
              ✦ Credentials & Certifications ({certs.length})
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 uppercase font-['Syne',sans-serif]">
              CERTIFICATIONS
            </h2>
            <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
              Industry-recognized credentials across Amazon Web Services (AWS), Microsoft Azure, Anthropic Claude GenAI, and GitHub DevOps.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 self-start md:self-end">
            {filterOptions.map((filter) => {
              const count =
                filter === 'All'
                  ? certs.length
                  : certs.filter((c) => getIssuerCategory(c.issuer) === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono',monospace] font-semibold transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-[#ff2a2a] text-white shadow-[0_4px_15px_rgba(255,42,42,0.4)]'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {filter} <span className="opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert, index) => (
            <CertificateCard key={cert.name + cert.code} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
