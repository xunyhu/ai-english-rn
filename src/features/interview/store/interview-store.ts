import { create } from 'zustand';

import type {
  FeedbackInterviewMessage,
  InterviewMessage,
  InterviewScenarioId,
  QuestionInterviewMessage,
  UserInterviewMessage,
} from '../types';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type InterviewState = {
  scenarioId: InterviewScenarioId | null;
  messages: InterviewMessage[];
  inputText: string;
  isStreaming: boolean;
  error: string | null;
  setScenarioId: (id: InterviewScenarioId | null) => void;
  setInputText: (text: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addUserMessage: (content: string) => UserInterviewMessage;
  addQuestionPlaceholder: () => QuestionInterviewMessage;
  addFeedbackPlaceholder: () => FeedbackInterviewMessage;
  updateQuestionMessage: (id: string, patch: Partial<QuestionInterviewMessage>) => void;
  updateFeedbackMessage: (id: string, patch: Partial<FeedbackInterviewMessage>) => void;
  setIsStreaming: (value: boolean) => void;
  resetInterview: () => void;
};

export const useInterviewStore = create<InterviewState>((set) => ({
  scenarioId: null,
  messages: [],
  inputText: '',
  isStreaming: false,
  error: null,

  setScenarioId: (id) => set({ scenarioId: id }),

  setInputText: (text) => set({ inputText: text }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  addUserMessage: (content) => {
    const message: UserInterviewMessage = {
      id: createId(),
      role: 'user',
      content: content.trim(),
      createdAt: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  addQuestionPlaceholder: () => {
    const message: QuestionInterviewMessage = {
      id: createId(),
      role: 'assistant',
      kind: 'question',
      question: '',
      createdAt: Date.now(),
      isStreaming: true,
      isError: false,
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  addFeedbackPlaceholder: () => {
    const message: FeedbackInterviewMessage = {
      id: createId(),
      role: 'assistant',
      kind: 'feedback',
      grammarCorrection: '',
      betterAnswer: '',
      vocabulary: [],
      createdAt: Date.now(),
      isStreaming: true,
      isError: false,
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  updateQuestionMessage: (id, patch) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.role === 'assistant' && msg.kind === 'question' && msg.id === id
          ? { ...msg, ...patch }
          : msg,
      ),
    }));
  },

  updateFeedbackMessage: (id, patch) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.role === 'assistant' && msg.kind === 'feedback' && msg.id === id
          ? { ...msg, ...patch }
          : msg,
      ),
    }));
  },

  setIsStreaming: (value) => set({ isStreaming: value }),

  resetInterview: () =>
    set({
      messages: [],
      inputText: '',
      isStreaming: false,
      error: null,
    }),
}));

export function selectCanSendAnswer(state: InterviewState): boolean {
  if (state.isStreaming || !state.scenarioId || state.inputText.trim().length === 0) {
    return false;
  }

  const last = state.messages[state.messages.length - 1];
  return last?.role === 'assistant' && last.kind === 'question' && !last.isStreaming;
}

export function selectCanAskNextQuestion(state: InterviewState): boolean {
  if (state.isStreaming || !state.scenarioId) return false;

  const last = state.messages[state.messages.length - 1];
  return last?.role === 'assistant' && last.kind === 'feedback' && !last.isStreaming && !last.isError;
}
