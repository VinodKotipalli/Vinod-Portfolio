import React from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  type: 'ai' | 'user';
  label?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive, type, label }) => {
  const isAi = type === 'ai';
  const barColor = isAi ? 'bg-[#ff2a2a]' : 'bg-emerald-400';

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-['JetBrains_Mono',monospace]">
      <div className="flex items-center gap-0.5 h-4">
        {[0.4, 0.8, 1, 0.6, 0.9, 0.5, 0.7].map((heightScale, i) => (
          <span
            key={i}
            className={`w-0.5 rounded-full transition-all duration-200 ${barColor} ${
              isActive ? 'animate-pulse' : 'opacity-30'
            }`}
            style={{
              height: isActive ? `${Math.max(4, heightScale * 16)}px` : '4px',
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}
      </div>
      <span className={isAi ? 'text-[#ff5858]' : 'text-emerald-400'}>
        {label || (isAi ? 'AI Speaking' : 'Listening...')}
      </span>
    </div>
  );
};
