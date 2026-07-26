import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../data/portfolioData';

const CertificateCard: React.FC<{ cert: CertificateItem; aosDelay: string }> = ({ cert, aosDelay }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={aosDelay}
    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] hover:border-[#ff2a2a]/40 transition-all duration-300 group flex items-center gap-4"
  >
    <div className="text-3xl p-3 bg-gray-100 rounded-xl group-hover:bg-red-50 group-hover:scale-110 transition-all">
      {cert.icon}
    </div>
    <div>
      <h3 className="text-gray-900 font-bold text-base md:text-lg tracking-tight group-hover:text-[#ff2a2a] transition-colors">
        {cert.name}
      </h3>
      <p className="text-gray-500 text-xs font-mono font-semibold uppercase mt-1">
        {cert.issuer}
      </p>
    </div>
  </div>
);

const Certificates: React.FC = () => {
  const { data } = usePortfolio();
  const certs = data.certificates;
  return (
    <section
      id="certificates"
      className="bg-white text-black pt-24 pb-32 px-6 md:px-12 w-full relative overflow-hidden font-sans bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px]"
    >
      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <div data-aos="fade-up" className="mb-16 text-center">
          <div className="inline-block border border-gray-300 rounded-full px-5 py-1.5 text-sm text-gray-700 font-bold mb-6 shadow-sm bg-gray-50">
            Credentials
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 uppercase">
            Certifications & Training
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Verified certifications from Oracle, NPTEL, Deloitte, TCS, Meta, and industry platforms.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {certs.featured.map((cert, index) => (
            <CertificateCard
              key={cert.name + index}
              cert={cert}
              aosDelay={String((index + 1) * 100)}
            />
          ))}
        </div>

        {/* View All Certificates CTA */}
        <div data-aos="fade-up" data-aos-delay="700" className="flex justify-center">
          <a
            href={certs.viewAllUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-black text-white font-bold text-base hover:bg-[#ff2a2a] hover:scale-105 hover:shadow-[0_10px_30px_rgba(255,42,42,0.3)] transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-[#ff2a2a] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View All Verified Certificates
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
