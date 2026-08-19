import axios from 'axios';
import {
  InterviewConfig,
  ChatMessage,
  InterviewEvaluation,
  InterviewSession,
} from '../types/interview';

const STORAGE_KEY = 'saivinod_interview_history_v1';

export const interviewService = {
  // Start a new interview
  async startInterview(config: InterviewConfig): Promise<{
    sessionId: string;
    greeting: string;
    firstQuestion: string;
    questionIndex: number;
    totalQuestions: number;
  }> {
    const response = await axios.post('/api/interview/start', {
      role: config.role,
      experience: config.experience,
      difficulty: config.difficulty,
      topic: config.topic,
      totalQuestions: config.totalQuestions,
      voiceMode: config.voiceMode,
    });
    return response.data;
  },

  // Submit candidate answer and get follow-up or next question
  async submitAnswer(params: {
    config: InterviewConfig;
    currentQuestionIndex: number;
    messages: ChatMessage[];
    candidateAnswer: string;
  }): Promise<{
    reply: string;
    isFollowUp: boolean;
    isCompleted: boolean;
    nextQuestionIndex: number;
    adaptiveFeedbackSnippet?: string;
  }> {
    const response = await axios.post('/api/interview/answer', {
      role: params.config.role,
      experience: params.config.experience,
      difficulty: params.config.difficulty,
      topic: params.config.topic,
      totalQuestions: params.config.totalQuestions,
      currentQuestionIndex: params.currentQuestionIndex,
      messages: params.messages,
      candidateAnswer: params.candidateAnswer,
    });
    return response.data;
  },

  // Evaluate complete interview
  async evaluateInterview(params: {
    config: InterviewConfig;
    durationSeconds: number;
    messages: ChatMessage[];
  }): Promise<InterviewEvaluation> {
    const response = await axios.post('/api/interview/evaluate', {
      role: params.config.role,
      experience: params.config.experience,
      difficulty: params.config.difficulty,
      topic: params.config.topic,
      totalQuestions: params.config.totalQuestions,
      durationSeconds: params.durationSeconds,
      messages: params.messages,
    });
    return response.data.evaluation;
  },

  // Get locally & server saved history
  getHistory(): InterviewSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn('Failed to parse interview history from localStorage', err);
    }
    return [];
  },

  // Save session to history
  async saveHistory(session: InterviewSession): Promise<InterviewSession[]> {
    try {
      const current = this.getHistory();
      const updated = [session, ...current.filter((s) => s.id !== session.id)].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Attempt background server sync
      axios.post('/api/interview/history', { session }).catch(() => {});
      return updated;
    } catch (err) {
      console.warn('Failed to save session to history', err);
      return [];
    }
  },

  // Delete session from history
  deleteHistoryItem(id: string): InterviewSession[] {
    try {
      const current = this.getHistory();
      const updated = current.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
};
