import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { InterviewSetup } from './InterviewSetup';
import { InterviewActive } from './InterviewActive';
import { InterviewEvaluation } from './InterviewEvaluation';
import { InterviewHistory } from './InterviewHistory';
import {
  Bot,
  Sparkles,
  ArrowLeft,
  History,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface MockInterviewPlatformProps {
  onBackToPortfolio?: () => void;
  isStandalone?: boolean;
}

export const MockInterviewPlatform: React.FC<MockInterviewPlatformProps> = ({
  onBackToPortfolio,
  isStandalone = false,
}) => {
  const { view, setView, isVoiceMode, setIsVoiceMode, stopAudio, history } = useInterview();

  return (
    <div
      id="mock-interview"
      className={`min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-[#ff2a2a] selection:text-white ${
        isStandalone ? 'pt-6' : 'pt-24 pb-20'
      }`}
    >
      {/* Platform Navigation Bar */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          {/* Left: Brand / Return */}
          <div className="flex items-center gap-3">
            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-['JetBrains_Mono',monospace] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#ff2a2a] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,42,42,0.4)]">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-['Syne',sans-serif] font-bold text-sm sm:text-base tracking-tight text-white">
                DevOps <span className="text-[#ff2a2a]">AI Interviewer</span>
              </span>
            </div>
          </div>

          {/* Right: Breadcrumb navigation tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopAudio();
                setView('setup');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] transition-colors cursor-pointer ${
                view === 'setup'
                  ? 'bg-[#ff2a2a] text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Setup
            </button>

            {view === 'interview' && (
              <button
                onClick={() => setView('interview')}
                className="px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] bg-[#ff2a2a] text-white font-bold cursor-pointer"
              >
                Live Interview
              </button>
            )}

            {view === 'evaluation' && (
              <button
                onClick={() => setView('evaluation')}
                className="px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] bg-[#ff2a2a] text-white font-bold cursor-pointer"
              >
                Evaluation
              </button>
            )}

            <button
              onClick={() => {
                stopAudio();
                setView('history');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] transition-colors cursor-pointer ${
                view === 'history'
                  ? 'bg-[#ff2a2a] text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History {history.length > 0 ? `(${history.length})` : ''}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1">
        {view === 'setup' && <InterviewSetup />}
        {view === 'interview' && <InterviewActive />}
        {view === 'evaluation' && <InterviewEvaluation />}
        {view === 'history' && <InterviewHistory />}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 text-center text-xs text-white/40 font-['JetBrains_Mono',monospace]">
        <span>Simulating real-world production incidents, architecture reviews, and DevOps hiring bars with Gemini 3.7.</span>
      </div>
    </div>
  );
};
