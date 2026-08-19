import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import {
  History,
  Calendar,
  Clock,
  Zap,
  Trash2,
  Eye,
  PlusCircle,
  Award,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export const InterviewHistory: React.FC = () => {
  const { history, loadSessionFromHistory, deleteSessionFromHistory, setView } = useInterview();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6" data-aos="fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <button
            onClick={() => setView('setup')}
            className="inline-flex items-center gap-1.5 text-xs font-['JetBrains_Mono',monospace] text-white/50 hover:text-white transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Interview Setup
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Syne',sans-serif] uppercase">
            Interview <span className="text-[#ff2a2a]">History</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-['Plus_Jakarta_Sans',sans-serif]">
            Review your past technical interviews, scores, and AI Hiring Manager evaluations.
          </p>
        </div>

        <button
          onClick={() => setView('setup')}
          className="px-4 py-2.5 rounded-xl bg-[#ff2a2a] hover:bg-[#ff3b3b] text-white text-xs sm:text-sm font-bold font-['Syne',sans-serif] uppercase tracking-wider flex items-center gap-2 shadow-[0_5px_20px_rgba(255,42,42,0.3)] transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Start New Interview
        </button>
      </div>

      {history.length === 0 ? (
        <div className="p-12 text-center bg-[#0b0b0b] border border-white/10 rounded-2xl">
          <History className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] mb-1">
            No Interview Records Yet
          </h3>
          <p className="text-xs text-white/50 font-['Plus_Jakarta_Sans',sans-serif] max-w-sm mx-auto mb-6">
            Take your first live technical interview with Gemini to generate your performance report
            and score breakdown.
          </p>
          <button
            onClick={() => setView('setup')}
            className="px-5 py-2.5 rounded-xl bg-[#ff2a2a] text-white text-xs font-bold font-['JetBrains_Mono',monospace] uppercase"
          >
            Launch Interviewer →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {history.map((item) => {
            const score = item.evaluation?.overallScore ?? 0;
            const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Left metadata */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-white font-['Outfit',sans-serif]">
                      {item.config.role}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#ff2a2a]/15 text-[#ff5858] text-[10px] font-['JetBrains_Mono',monospace] font-bold border border-[#ff2a2a]/30">
                      {item.config.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-['JetBrains_Mono',monospace]">
                      {item.config.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-['JetBrains_Mono',monospace] text-white/50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {Math.round(item.durationSeconds / 60)} min ({item.messages.length} exchanges)
                    </span>
                    <span>Exp: {item.config.experience}</span>
                  </div>
                </div>

                {/* Right: Score & Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {/* Score Pill */}
                  <div className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/10">
                    <Award className="w-4 h-4 text-[#ff2a2a]" />
                    <span className="text-base font-black text-white font-['Syne',sans-serif]">
                      {score}
                    </span>
                    <span className="text-[10px] text-white/40 font-['JetBrains_Mono',monospace]">
                      /100
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadSessionFromHistory(item)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-['JetBrains_Mono',monospace] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Result</span>
                    </button>

                    <button
                      onClick={() => deleteSessionFromHistory(item.id)}
                      title="Delete record"
                      className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
