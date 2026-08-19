import React from 'react';
import { Bot, Sparkles, ArrowRight, Mic, ShieldCheck, Zap } from 'lucide-react';

interface FeaturedInterviewCardProps {
  onOpenInterview: () => void;
}

export const FeaturedInterviewCard: React.FC<FeaturedInterviewCardProps> = ({
  onOpenInterview,
}) => {
  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          data-aos="fade-up"
          className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#120808] via-[#0b0b0b] to-[#1a0707] border border-[#ff2a2a]/30 shadow-[0_20px_50px_rgba(255,42,42,0.15)] overflow-hidden group"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#ff2a2a]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ff2a2a]/25 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff2a2a]/15 border border-[#ff2a2a]/40 text-[#ff5858] text-xs font-['JetBrains_Mono',monospace] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping" />
                <span>New AI Feature</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-['Syne',sans-serif] uppercase tracking-tight leading-tight">
                AI Mock Interview <span className="text-[#ff2a2a]">Platform</span>
              </h2>

              <p className="text-sm sm:text-base text-white/80 font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed">
                An AI-powered technical interview platform that conducts adaptive DevOps interviews,
                evaluates candidate responses, asks contextual follow-up questions, and generates
                personalized interview feedback.
              </p>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-['JetBrains_Mono',monospace] text-white/80 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#ff2a2a]" />
                  Adaptive Gemini 3.7
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-['JetBrains_Mono',monospace] text-white/80 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  Voice Interview Mode
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-['JetBrains_Mono',monospace] text-white/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  Detailed 5-Pillar Score Audit
                </span>
              </div>

              {/* CTA Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onOpenInterview}
                  className="px-6 py-3.5 rounded-xl bg-[#ff2a2a] hover:bg-[#ff3b3b] text-white font-bold font-['Syne',sans-serif] uppercase tracking-wider text-sm sm:text-base shadow-[0_10px_30px_rgba(255,42,42,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Start Interview →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Interactive Preview Graphic */}
            <div className="lg:col-span-5">
              <div className="bg-black/60 border border-white/15 rounded-2xl p-5 backdrop-blur-xl shadow-2xl space-y-3 font-['JetBrains_Mono',monospace] text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white/50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] text-white/40">interview-session.live</span>
                </div>

                <div className="space-y-2.5 text-white/80">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white">
                    <p className="text-[11px] font-bold text-[#ff5858] mb-1">
                      AI Interviewer [Question 1/5]:
                    </p>
                    <p className="text-[11px] text-white/90 leading-relaxed font-['Plus_Jakarta_Sans',sans-serif]">
                      "An Amazon EKS pod is stuck in CrashLoopBackOff. Walk me through your command-line investigation."
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/20 text-white">
                    <p className="text-[10px] font-bold text-white/60 mb-0.5">Candidate:</p>
                    <p className="text-[10px] text-white/80 font-['Plus_Jakarta_Sans',sans-serif]">
                      "kubectl describe pod & kubectl logs --previous..."
                    </p>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-between">
                    <span>Performance Score: 88/100</span>
                    <span>Ready for AWS DevOps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
