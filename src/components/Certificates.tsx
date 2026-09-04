import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { CertificateItem } from '../data/portfolioData';
import MotionCard from './MotionCard';
import MaskedHeading from './MaskedHeading';
import { StaggerContainer, StaggerItem } from './StaggerReveal';

// 1. AWS Logo with clear, unmistakable 'AWS' typography and vibrant orange smile arrow
const AwsProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 dark:border-white/20 flex flex-col items-center justify-center p-1.5 shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden select-none">
    <span className="text-[#232F3E] font-black text-sm leading-none tracking-tight font-['Outfit',sans-serif]">
      AWS
    </span>
    <svg viewBox="0 0 36 8" className="w-6 h-auto mt-1" fill="none">
      <path
        d="M2 2.5C10 6.5 24 6.5 32 2.5"
        stroke="#FF9900"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 1.5L34.5 3L32.5 6"
        fill="#FF9900"
      />
    </svg>
  </div>
);

// 2. Microsoft Logo matching uploaded image (4-color square logo)
const MicrosoftProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 dark:border-white/20 flex items-center justify-center p-2.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <div className="grid grid-cols-2 gap-1 w-6 h-6">
      <div className="bg-[#F25022] rounded-[1px] w-full h-full" />
      <div className="bg-[#7FBA00] rounded-[1px] w-full h-full" />
      <div className="bg-[#00A4EF] rounded-[1px] w-full h-full" />
      <div className="bg-[#FFB900] rounded-[1px] w-full h-full" />
    </div>
  </div>
);

// 3. GitHub Logo matching uploaded image (Black rounded badge with white circle and black cat)
const GitHubProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-black border border-slate-200 dark:border-white/20 flex items-center justify-center p-1.5 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    </div>
  </div>
);

// 4. Anthropic Claude Logo matching uploaded image (Off-white / cream background with bold Anthropic 'A\' mark)
const AnthropicProviderLogo: React.FC = () => (
  <div className="w-11 h-11 rounded-xl bg-[#FBF9F4] border border-slate-200 dark:border-white/20 flex items-center justify-center p-2 shadow-md shrink-0 group-hover:scale-105 transition-transform">
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#141413]">
      <path d="M17.4 3h-3.3L8.3 18.5h3.4l1.2-3.4h5.8l1.2 3.4h3.4L17.4 3zm-3.5 9.5l1.9-5.3 1.9 5.3h-3.8zM6.6 18.5H3.2L9 3h3.4L6.6 18.5z" />
    </svg>
  </div>
);

const ProviderLogo: React.FC<{ issuer: string; name: string }> = ({ issuer, name }) => {
  const text = (issuer + ' ' + name).toLowerCase();
  if (text.includes('amazon') || text.includes('aws')) return <AwsProviderLogo />;
  if (text.includes('anthropic') || text.includes('claude')) return <AnthropicProviderLogo />;
  if (text.includes('github')) return <GitHubProviderLogo />;
  return <MicrosoftProviderLogo />;
};

const getIssuerCategory = (issuer: string) => {
  const lower = issuer.toLowerCase();
  if (lower.includes('amazon') || lower.includes('aws')) return 'AWS';
  if (lower.includes('microsoft')) return 'Microsoft Azure';
  if (lower.includes('anthropic') || lower.includes('claude')) return 'Anthropic Claude';
  if (lower.includes('github')) return 'GitHub';
  return 'Cloud & AI';
};

const CertificateCard: React.FC<{ cert: CertificateItem; index: number }> = ({ cert }) => {
  const { theme } = useTheme();
  const issuerCat = getIssuerCategory(cert.issuer);

  return (
    <StaggerItem
      direction="up"
      customDistance={32}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <MotionCard
        className={`backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between h-full ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] hover:shadow-[0_15px_35px_rgba(6,182,212,0.12)]'
            : 'bg-slate-50 border-slate-200 hover:border-cyan-500/50 hover:bg-white hover:shadow-md'
        }`}
        glowColor={theme === 'dark' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(2, 132, 199, 0.12)'}
      >
        <div>
          {/* Top bar: Provider Logo, Code Badge & Dates */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <ProviderLogo issuer={cert.issuer} name={cert.name} />
              <div>
                <span className={`text-[11px] font-['Space_Grotesk',sans-serif] font-bold block ${
                  theme === 'dark' ? 'text-white/90' : 'text-slate-800'
                }`}>
                  {cert.issuer}
                </span>
                <span className={`text-[10px] font-['JetBrains_Mono',monospace] ${
                  theme === 'dark' ? 'text-white/50' : 'text-slate-500'
                }`}>
                  {cert.issueDate ? `Issued ${cert.issueDate}` : cert.year}
                  {cert.expiryDate ? ` · Exp ${cert.expiryDate}` : ''}
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider shrink-0 border ${
              theme === 'dark'
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50 border-cyan-200 text-cyan-800'
            }`}>
              {cert.code}
            </span>
          </div>

          {/* Certificate Title */}
          <h3 className={`font-bold text-base sm:text-lg tracking-tight group-hover:text-cyan-400 transition-colors leading-snug mb-2 font-['Outfit',sans-serif] ${
            theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-cyan-700'
          }`}>
            {cert.name}
          </h3>

          {/* Description */}
          {cert.description && (
            <p className={`text-xs font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed mb-3 ${
              theme === 'dark' ? 'text-white/70' : 'text-slate-600'
            }`}>
              {cert.description}
            </p>
          )}

          {/* Skills Chips */}
          {cert.skills && cert.skills.length > 0 && (
            <div className={`flex flex-wrap gap-1 mb-4 pt-2 border-t ${
              theme === 'dark' ? 'border-white/5' : 'border-slate-200'
            }`}>
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-2 py-0.5 rounded text-[9px] font-['JetBrains_Mono',monospace] border ${
                    theme === 'dark'
                      ? 'bg-black/50 border-white/10 text-white/80'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Verification Badge */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 text-xs font-['JetBrains_Mono',monospace] ${
          theme === 'dark' ? 'border-white/10 text-white/50' : 'border-slate-200 text-slate-500'
        }`}>
          <span className={`flex items-center gap-1.5 text-[10px] ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Verified Credential
          </span>

          <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
            {issuerCat}
          </span>
        </div>
      </MotionCard>
    </StaggerItem>
  );
};

export const Certificates: React.FC = () => {
  const { data } = usePortfolio();
  const { theme } = useTheme();
  const certs = data.certificates;

  return (
    <section
      id="certifications"
      className={`pt-24 pb-32 px-5 sm:px-8 md:px-12 w-full relative overflow-hidden font-sans border-t transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#080808] text-white border-white/10'
          : 'bg-white text-slate-900 border-slate-200'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 text-center md:text-left"
        >
          <div className={`inline-block rounded-full px-5 py-1.5 text-xs sm:text-sm font-['JetBrains_Mono',monospace] font-semibold mb-4 shadow-sm backdrop-blur-sm uppercase tracking-[0.25em] border transition-colors ${
            theme === 'dark'
              ? 'border-cyan-500/30 text-cyan-300 bg-cyan-500/5'
              : 'border-cyan-200 text-cyan-800 bg-cyan-50'
          }`}>
            ✦ Credentials & Certifications ({certs.length})
          </div>
          <MaskedHeading
            text="CERTIFICATIONS"
            as="h2"
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 uppercase font-['Syne',sans-serif] transition-colors ${
              theme === 'dark' ? 'text-white' : 'text-slate-950'
            }`}
          />
          <p className={`text-sm sm:text-base md:text-lg max-w-2xl font-light font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-white/70' : 'text-slate-600'
          }`}>
            Official certifications from Amazon Web Services (AWS) validating solutions architecture and cloud operations expertise.
          </p>
        </motion.div>

        {/* Certificate Cards Grid with Sequential Staggered Entrance */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.09}
          viewportAmount={0.12}
        >
          {certs.map((cert, index) => (
            <CertificateCard key={cert.name + cert.code} cert={cert} index={index} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Certificates;
