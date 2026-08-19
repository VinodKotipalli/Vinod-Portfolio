import React, { useState, useEffect, useRef } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { speechService } from '../../services/speechService';
import { VoiceVisualizer } from './VoiceVisualizer';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  StopCircle,
  Clock,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const InterviewActive: React.FC = () => {
  const {
    session,
    isLoading,
    isEvaluating,
    handleSubmitAnswer,
    handleEndInterview,
    timerSeconds,
    isVoiceMode,
    setIsVoiceMode,
    isAiSpeaking,
    isCandidateListening,
    toggleMic,
    speakAiMessage,
    stopAudio,
    error,
  } = useInterview();

  const [answerInput, setAnswerInput] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Format timer as mm:ss
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isLoading]);

  // Speech Recognition listener integration
  useEffect(() => {
    if (isVoiceMode && isCandidateListening) {
      speechService.startListening(
        (transcript) => {
          setAnswerInput((prev) => {
            if (!prev) return transcript;
            return prev + ' ' + transcript;
          });
        },
        (err) => {
          console.warn('Voice input error:', err);
        }
      );
    } else {
      speechService.stopListening();
    }
    return () => {
      speechService.stopListening();
    };
  }, [isVoiceMode, isCandidateListening]);

  if (!session) {
    return null;
  }

  const { config, messages, currentQuestionIndex } = session;
  const progressPercent = Math.min(
    100,
    Math.round((currentQuestionIndex / config.totalQuestions) * 100)
  );

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!answerInput.trim() || isLoading) return;

    const currentText = answerInput.trim();
    setAnswerInput('');
    await handleSubmitAnswer(currentText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Top Header Card: Progress, Info & Controls */}
      <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-xl shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          {/* Role & Context Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2a2a] to-red-700 flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,42,42,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white font-['Outfit',sans-serif]">
                  {config.role}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-['JetBrains_Mono',monospace] text-white/80">
                  {config.difficulty}
                </span>
              </div>
              <p className="text-xs text-white/50 font-['Plus_Jakarta_Sans',sans-serif]">
                Topic: <span className="text-white/80 font-medium">{config.topic}</span> • Exp:{' '}
                <span className="text-white/80 font-medium">{config.experience}</span>
              </p>
            </div>
          </div>

          {/* Timer & Voice Controls */}
          <div className="flex items-center gap-3">
            {/* Live Audio Visualizers */}
            {isVoiceMode && isAiSpeaking && (
              <VoiceVisualizer isActive={true} type="ai" label="AI Speaking" />
            )}
            {isVoiceMode && isCandidateListening && (
              <VoiceVisualizer isActive={true} type="user" label="Listening..." />
            )}

            {/* Voice Mode Toggle */}
            <button
              onClick={() => {
                if (isVoiceMode) {
                  stopAudio();
                  setIsVoiceMode(false);
                } else {
                  setIsVoiceMode(true);
                  // Speak latest message
                  const lastInterviewerMsg = [...messages]
                    .reverse()
                    .find((m) => m.role === 'interviewer');
                  if (lastInterviewerMsg) {
                    speakAiMessage(lastInterviewerMsg.content);
                  }
                }
              }}
              title={isVoiceMode ? 'Disable Voice Mode' : 'Enable Voice Mode'}
              className={`p-2 rounded-xl border text-xs font-['JetBrains_Mono',monospace] flex items-center gap-1.5 transition-colors ${
                isVoiceMode
                  ? 'bg-[#ff2a2a]/20 border-[#ff2a2a] text-[#ff5858]'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {isVoiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isVoiceMode ? 'Voice ON' : 'Voice OFF'}</span>
            </button>

            {/* Timer Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-['JetBrains_Mono',monospace] text-white">
              <Clock className="w-3.5 h-3.5 text-[#ff5858]" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>

            {/* End Interview Early Button */}
            <button
              onClick={() => setShowEndConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-['JetBrains_Mono',monospace] transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Progress Bar & Question Count */}
        <div className="pt-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ff2a2a] to-red-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold font-['JetBrains_Mono',monospace] text-white/70 shrink-0">
            Question {currentQuestionIndex} of {config.totalQuestions}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Conversation Stream */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, idx) => {
          const isInterviewer = msg.role === 'interviewer';
          return (
            <div
              key={msg.id || idx}
              data-aos="fade-up"
              className={`flex gap-3 sm:gap-4 ${isInterviewer ? 'justify-start' : 'justify-end'}`}
            >
              {isInterviewer && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ff2a2a] text-white flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,42,42,0.3)] mt-1">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 border transition-all ${
                  isInterviewer
                    ? 'bg-[#111111] border-white/10 text-white/90 shadow-lg'
                    : 'bg-gradient-to-br from-[#ff2a2a]/20 to-[#ff2a2a]/5 border-[#ff2a2a]/30 text-white'
                }`}
              >
                {/* Header within bubble */}
                <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-['Space_Grotesk',sans-serif] uppercase tracking-wider text-white/50">
                      {isInterviewer ? 'AI Technical Interviewer' : 'Candidate (You)'}
                    </span>
                    {msg.isFollowUp && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-['JetBrains_Mono',monospace]">
                        Follow-Up
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isInterviewer && (
                      <button
                        onClick={() => speakAiMessage(msg.content)}
                        title="Replay Audio"
                        className="text-white/40 hover:text-white transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-[10px] font-['JetBrains_Mono',monospace] text-white/40">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="text-xs sm:text-sm font-['Plus_Jakarta_Sans',sans-serif] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>

              {!isInterviewer && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* AI Typing / Thinking Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3" data-aos="fade-up">
            <div className="w-8 h-8 rounded-xl bg-[#ff2a2a] text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#111111] border border-white/10 flex items-center gap-2 text-xs font-['JetBrains_Mono',monospace] text-white/70">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span>Interviewer is analyzing your response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Candidate Answer Input Dock */}
      <div className="sticky bottom-4 z-20">
        <form
          onSubmit={onSubmit}
          className="bg-[#0b0b0b]/95 border border-white/15 rounded-2xl p-3 sm:p-4 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={3}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Explain your approach, CLI commands, architecture decisions, or troubleshooting steps... (Cmd/Ctrl + Enter to submit)"
              className="w-full bg-white/5 border border-white/10 focus:border-[#ff2a2a] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[#ff2a2a] resize-none font-['Plus_Jakarta_Sans',sans-serif]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-2 border-t border-white/5">
            {/* Left Controls: Speech Dictation Toggle & Character Count */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMic}
                title={isCandidateListening ? 'Stop Dictation' : 'Start Speech Dictation'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-['JetBrains_Mono',monospace] transition-all ${
                  isCandidateListening
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {isCandidateListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {isCandidateListening ? 'Listening...' : 'Voice Dictate'}
                </span>
              </button>

              <span className="text-[10px] font-['JetBrains_Mono',monospace] text-white/40">
                {answerInput.length} chars
              </span>
            </div>

            {/* Right Controls: Submit Button */}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!answerInput.trim() || isLoading}
                className="px-5 py-2 rounded-xl bg-[#ff2a2a] hover:bg-[#ff3b3b] disabled:opacity-40 disabled:hover:bg-[#ff2a2a] text-white text-xs sm:text-sm font-bold font-['Syne',sans-serif] uppercase tracking-wider shadow-[0_5px_20px_rgba(255,42,42,0.3)] transition-all flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal to End Interview Early */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Syne',sans-serif] uppercase mb-2">
              Conclude Interview Early?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 font-['Plus_Jakarta_Sans',sans-serif] mb-6">
              Your technical responses up to this point will be analyzed and scored by the AI Hiring Manager.
              You will receive your full performance score report immediately.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-['JetBrains_Mono',monospace] transition-colors"
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowEndConfirm(false);
                  await handleEndInterview();
                }}
                className="px-4 py-2 rounded-xl bg-[#ff2a2a] hover:bg-[#ff3b3b] text-white text-xs font-bold font-['JetBrains_Mono',monospace] transition-colors"
              >
                Generate Performance Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
