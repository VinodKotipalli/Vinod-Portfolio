import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  InterviewConfig,
  ChatMessage,
  InterviewEvaluation,
  InterviewSession,
  INTERVIEW_ROLES,
  EXPERIENCE_LEVELS,
  DIFFICULTY_LEVELS,
} from '../types/interview';
import { interviewService } from '../services/interviewService';
import { speechService } from '../services/speechService';

interface InterviewContextType {
  // Navigation & View
  view: 'setup' | 'interview' | 'evaluation' | 'history';
  setView: (view: 'setup' | 'interview' | 'evaluation' | 'history') => void;

  // Configuration
  config: InterviewConfig;
  setConfig: React.Dispatch<React.SetStateAction<InterviewConfig>>;

  // Active State
  session: InterviewSession | null;
  isLoading: boolean;
  isEvaluating: boolean;
  error: string | null;
  timerSeconds: number;

  // Voice & Audio
  isVoiceMode: boolean;
  setIsVoiceMode: (enabled: boolean) => void;
  isAiSpeaking: boolean;
  isCandidateListening: boolean;
  toggleMic: () => void;
  speakAiMessage: (text: string) => void;
  stopAudio: () => void;

  // Core Actions
  handleStartInterview: (overrideConfig?: InterviewConfig) => Promise<void>;
  handleSubmitAnswer: (answerText: string) => Promise<void>;
  handleEndInterview: () => Promise<void>;
  handleRestartInterview: () => void;
  handleRetrySameTopic: () => Promise<void>;

  // History
  history: InterviewSession[];
  loadSessionFromHistory: (session: InterviewSession) => void;
  deleteSessionFromHistory: (sessionId: string) => void;
}

const defaultConfig: InterviewConfig = {
  role: INTERVIEW_ROLES[0],
  experience: EXPERIENCE_LEVELS[1], // '2–4 Years'
  difficulty: DIFFICULTY_LEVELS[1], // 'Intermediate'
  topic: 'Kubernetes',
  totalQuestions: 5,
  voiceMode: false,
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<'setup' | 'interview' | 'evaluation' | 'history'>('setup');
  const [config, setConfig] = useState<InterviewConfig>(defaultConfig);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Audio / Voice State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCandidateListening, setIsCandidateListening] = useState(false);

  // History State
  const [history, setHistory] = useState<InterviewSession[]>(() => interviewService.getHistory());

  // Timer Ref
  const timerIntervalRef = useRef<any>(null);

  // Manage Timer when session is active
  useEffect(() => {
    if (session?.status === 'active') {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [session?.status]);

  // Audio speech synthesis helper
  const speakAiMessage = (text: string) => {
    if (!isVoiceMode) return;
    setIsAiSpeaking(true);
    speechService.speak(
      text,
      () => setIsAiSpeaking(true),
      () => setIsAiSpeaking(false)
    );
  };

  const stopAudio = () => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setIsAiSpeaking(false);
    setIsCandidateListening(false);
  };

  const toggleMic = () => {
    if (isCandidateListening) {
      speechService.stopListening();
      setIsCandidateListening(false);
    } else {
      speechService.startListening(
        () => {},
        (err) => {
          console.warn('Mic toggle err:', err);
          setIsCandidateListening(false);
        }
      );
      setIsCandidateListening(true);
    }
  };

  // Start new interview
  const handleStartInterview = async (overrideConfig?: InterviewConfig) => {
    const activeCfg = overrideConfig || config;
    setIsLoading(true);
    setError(null);
    setTimerSeconds(0);
    stopAudio();

    try {
      const data = await interviewService.startInterview(activeCfg);

      const firstInterviewerMessage: ChatMessage = {
        id: 'msg_greet_0',
        role: 'interviewer',
        content: `${data.greeting}\n\n**Question 1:** ${data.firstQuestion}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionNumber: 1,
      };

      const newSession: InterviewSession = {
        id: data.sessionId || `session_${Date.now()}`,
        createdAt: new Date().toISOString(),
        durationSeconds: 0,
        config: activeCfg,
        messages: [firstInterviewerMessage],
        currentQuestionIndex: 1,
        status: 'active',
      };

      setSession(newSession);
      setView('interview');

      if (activeCfg.voiceMode || isVoiceMode) {
        speakAiMessage(firstInterviewerMessage.content);
      }
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setError(err?.response?.data?.error || 'Unable to connect to the AI interviewer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Candidate submits an answer
  const handleSubmitAnswer = async (answerText: string) => {
    if (!session || !answerText.trim()) return;

    setIsLoading(true);
    setError(null);
    stopAudio();

    const candidateMsg: ChatMessage = {
      id: `msg_ans_${Date.now()}`,
      role: 'candidate',
      content: answerText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      questionNumber: session.currentQuestionIndex,
    };

    const updatedMessages = [...session.messages, candidateMsg];

    setSession((prev) => (prev ? { ...prev, messages: updatedMessages } : null));

    try {
      const data = await interviewService.submitAnswer({
        config: session.config,
        currentQuestionIndex: session.currentQuestionIndex,
        messages: updatedMessages,
        candidateAnswer: answerText.trim(),
      });

      const interviewerReplyMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'interviewer',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFollowUp: data.isFollowUp,
        questionNumber: data.nextQuestionIndex,
      };

      const allMessages = [...updatedMessages, interviewerReplyMsg];

      if (data.isCompleted) {
        // Complete the interview and trigger evaluation
        await finalizeAndEvaluateSession(allMessages, timerSeconds);
      } else {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                messages: allMessages,
                currentQuestionIndex: data.nextQuestionIndex,
              }
            : null
        );

        if (session.config.voiceMode || isVoiceMode) {
          speakAiMessage(data.reply);
        }
      }
    } catch (err: any) {
      console.error('Error submitting answer:', err);
      setError(err?.response?.data?.error || 'Failed to analyze answer with AI interviewer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: finalize interview and trigger AI evaluation
  const finalizeAndEvaluateSession = async (
    transcript: ChatMessage[],
    finalDuration: number
  ) => {
    if (!session) return;
    setIsEvaluating(true);
    setSession((prev) => (prev ? { ...prev, status: 'evaluating' } : null));
    setView('evaluation');

    try {
      const evaluation: InterviewEvaluation = await interviewService.evaluateInterview({
        config: session.config,
        durationSeconds: finalDuration,
        messages: transcript,
      });

      const completedSession: InterviewSession = {
        ...session,
        durationSeconds: finalDuration,
        messages: transcript,
        evaluation,
        status: 'completed',
      };

      setSession(completedSession);

      // Save to history
      const updatedHistory = await interviewService.saveHistory(completedSession);
      setHistory(updatedHistory);
    } catch (err: any) {
      console.error('Evaluation error:', err);
      setError('Could not complete evaluation analysis. Please retry.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // End interview early on user request
  const handleEndInterview = async () => {
    if (!session || session.messages.length === 0) {
      setView('setup');
      return;
    }
    stopAudio();
    await finalizeAndEvaluateSession(session.messages, timerSeconds);
  };

  const handleRestartInterview = () => {
    stopAudio();
    setSession(null);
    setError(null);
    setView('setup');
  };

  const handleRetrySameTopic = async () => {
    if (session) {
      await handleStartInterview(session.config);
    } else {
      await handleStartInterview();
    }
  };

  const loadSessionFromHistory = (histSession: InterviewSession) => {
    stopAudio();
    setSession(histSession);
    setConfig(histSession.config);
    setView('evaluation');
  };

  const deleteSessionFromHistory = (sessionId: string) => {
    const updated = interviewService.deleteHistoryItem(sessionId);
    setHistory(updated);
    if (session?.id === sessionId) {
      setSession(null);
      setView('setup');
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        view,
        setView,
        config,
        setConfig,
        session,
        isLoading,
        isEvaluating,
        error,
        timerSeconds,
        isVoiceMode,
        setIsVoiceMode,
        isAiSpeaking,
        isCandidateListening,
        toggleMic,
        speakAiMessage,
        stopAudio,
        handleStartInterview,
        handleSubmitAnswer,
        handleEndInterview,
        handleRestartInterview,
        handleRetrySameTopic,
        history,
        loadSessionFromHistory,
        deleteSessionFromHistory,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = (): InterviewContextType => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
