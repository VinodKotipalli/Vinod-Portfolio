import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../data/portfolioData';

const CertificateCard: React.FC<{ cert: CertificateItem; index: number }> = ({ cert, index }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={String((index + 1) * 100)}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-[#ff2a2a]/50 hover:bg-white/[0.08] hover:shadow-[0_20px_50px_rgba(255,42,42,0.15)] transition-all duration-300 group flex flex-col justify-between"
  >
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
          {cert.icon}
        </div>
        <span className="px-3 py-1 rounded-full bg-[#ff2a2a]/20 border border-[#ff2a2a]/30 text-[#ff2a2a] text-xs font-mono font-bold uppercase">
          {cert.code}
        </span>
      </div>

      <h3 className="text-white font-bold text-lg sm:text-xl tracking-tight group-hover:text-[#ff2a2a] transition-colors leading-snug mb-3">
        {cert.name}
      </h3>

      <p className="text-white/60 text-xs sm:text-sm font-mono font-semibold uppercase">
        {cert.issuer} • {cert.year}
      </p>
    </div>

    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
      <span className="flex items-center gap-1.5 text-white/80">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Verified Certification
      </span>
      <span>AWS</span>
    </div>
  </div>
);

const Certificates: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certificates;

  return (
    <section
      id="certifications"
      className="bg-[#080808] text-white pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 text-center md:text-left">
          <div className="inline-block border border-white/20 rounded-full px-5 py-1.5 text-xs sm:text-sm text-white/70 font-bold mb-4 shadow-sm bg-white/5 backdrop-blur-sm uppercase tracking-widest">
            Credentials & Validation
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 uppercase font-['Kanit',sans-serif]">
            CERTIFICATIONS
          </h2>
          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            Official Amazon Web Services professional certifications validating architectural design and cloud operations expertise.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {certs.map((cert, index) => (
            <CertificateCard key={cert.name} cert={cert} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
