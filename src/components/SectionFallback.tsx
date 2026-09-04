import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface SectionFallbackProps {
  minHeight?: string;
  title?: string;
}

export const SectionFallback: React.FC<SectionFallbackProps> = ({
  minHeight = 'min-h-[400px]',
  title,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full ${minHeight} flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#080808] text-white/60 border-t border-white/5' : 'bg-slate-50 text-slate-500 border-t border-slate-200'
      }`}
      aria-busy="true"
      aria-label={title ? `Loading ${title}` : 'Loading section'}
    >
      {/* Subtle pulse ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent pointer-events-none" />

      <div className="flex flex-col items-center gap-4 relative z-10 max-w-sm text-center">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {title && (
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-xs">✦</span>
            <span className="text-xs font-['JetBrains_Mono',monospace] uppercase tracking-[0.2em] font-semibold">
              Loading {title}
            </span>
          </div>
        )}

        {/* Minimal skeleton loader bar */}
        <div className="w-44 h-1.5 rounded-full bg-cyan-500/10 overflow-hidden relative">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SectionFallback;
