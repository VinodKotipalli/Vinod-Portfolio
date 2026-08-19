import React, { useState } from 'react';
import {
  INTERVIEW_ROLES,
  EXPERIENCE_LEVELS,
  DIFFICULTY_LEVELS,
  INTERVIEW_TOPICS,
  InterviewRole,
  ExperienceLevel,
  DifficultyLevel,
} from '../../types/interview';
import { useInterview } from '../../context/InterviewContext';
import {
  Sparkles,
  Mic,
  Clock,
  Zap,
  CheckCircle,
  Brain,
  History,
  Shield,
  Layers,
} from 'lucide-react';

export const InterviewSetup: React.FC = () => {
  const { config, setConfig, handleStartInterview, isLoading, error, setView, history } =
    useInterview();

  const [activeCategory, setActiveCategory] = useState<'AWS' | 'DevOps' | 'Advanced'>('AWS');

  const handleRoleSelect = (role: InterviewRole) => {
    setConfig((prev) => ({ ...prev, role }));
  };

  const handleExpSelect = (experience: ExperienceLevel) => {
    setConfig((prev) => ({ ...prev, experience }));
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setConfig((prev) => ({ ...prev, difficulty }));
  };

  const handleTopicSelect = (topic: string) => {
    setConfig((prev) => ({ ...prev, topic }));
  };

  const handleQuestionsCountSelect = (totalQuestions: number) => {
    setConfig((prev) => ({ ...prev, totalQuestions }));
  };

  const toggleVoiceMode = () => {
    setConfig((prev) => ({ ...prev, voiceMode: !prev.voiceMode }));
  };

  const currentCategoryGroup = INTERVIEW_TOPICS.find((g) => g.category === activeCategory);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="text-center mb-10" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-[#ff5858] text-xs font-['JetBrains_Mono',monospace] uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Powered by Google Gemini 3.7
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Syne',sans-serif] uppercase mb-3">
          AI Live <span className="text-[#ff2a2a]">Mock Interview</span>
        </h1>
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-['Plus_Jakarta_Sans',sans-serif]">
          Practice real-world technical interviews with an AI interviewer. Experience adaptive follow-up
          scenarios and receive an in-depth DevOps engineering performance audit.
        </p>

        {history.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setView('history')}
              className="inline-flex items-center gap-2 text-xs font-['JetBrains_Mono',monospace] text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-[#ff5858]" />
              View Past Interviews ({history.length})
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-3">
          <Shield className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Configuration Form Card */}
      <div className="bg-[#0b0b0b]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8">
        {/* 1. Target Role Selection */}
        <div>
          <label className="block text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff2a2a]" />
            1. Select Interview Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {INTERVIEW_ROLES.map((r) => {
              const isSelected = config.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`p-3 rounded-xl text-xs font-['Outfit',sans-serif] font-bold text-left transition-all duration-200 border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#ff2a2a] text-white border-[#ff2a2a] shadow-[0_0_15px_rgba(255,42,42,0.3)]'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className="truncate">{r}</span>
                  {isSelected && <CheckCircle className="w-3.5 h-3.5 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Level & Difficulty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff2a2a]" />
              2. Experience Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {EXPERIENCE_LEVELS.map((exp) => {
                const isSelected = config.experience === exp;
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => handleExpSelect(exp)}
                    className={`p-2.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] font-bold text-center transition-all border ${
                      isSelected
                        ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {exp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ff2a2a]" />
              3. Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_LEVELS.map((diff) => {
                const isSelected = config.difficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => handleDifficultySelect(diff)}
                    className={`p-2.5 rounded-xl text-xs font-['JetBrains_Mono',monospace] font-bold text-center transition-all border ${
                      isSelected
                        ? 'bg-[#ff2a2a] text-white border-[#ff2a2a]'
                        : 'bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Interview Topic Selection */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#ff2a2a]" />
              4. Select Topic ({activeCategory})
            </label>

            {/* Category Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/60 border border-white/10 text-xs font-['JetBrains_Mono',monospace]">
              {INTERVIEW_TOPICS.map((cat) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCategory(cat.category)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    activeCategory === cat.category
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {currentCategoryGroup?.topics.map((t) => {
              const isSelected = config.topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTopicSelect(t)}
                  className={`p-2.5 rounded-xl text-xs font-['Outfit',sans-serif] font-medium text-left transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#ff2a2a]/20 text-[#ff5858] border-[#ff2a2a] font-bold'
                      : 'bg-white/5 text-white/80 border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="truncate">{t}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Number of Questions & Voice Mode Settings */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Question Count Selection */}
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest font-['JetBrains_Mono',monospace] mb-2">
              5. Number of Questions
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 15].map((qCount) => {
                const isSelected = config.totalQuestions === qCount;
                return (
                  <button
                    key={qCount}
                    type="button"
                    onClick={() => handleQuestionsCountSelect(qCount)}
                    className={`flex-1 py-2 rounded-xl text-xs font-['JetBrains_Mono',monospace] font-bold transition-all border ${
                      isSelected
                        ? 'bg-white/20 text-white border-white/40'
                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    {qCount} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Interview Mode Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  config.voiceMode ? 'bg-[#ff2a2a] text-white' : 'bg-white/10 text-white/50'
                }`}
              >
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                  Voice Interview Mode
                </p>
                <p className="text-[10px] text-white/50 font-['Plus_Jakarta_Sans',sans-serif]">
                  Listen to questions & speak your answers
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleVoiceMode}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                config.voiceMode ? 'bg-[#ff2a2a]' : 'bg-white/20'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  config.voiceMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleStartInterview()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff2a2a] to-[#d91e1e] hover:from-[#ff3838] hover:to-[#ea2525] text-white font-bold font-['Syne',sans-serif] uppercase tracking-wider text-base shadow-[0_10px_30px_rgba(255,42,42,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing Interview Scenario...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Start Live Interview</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
