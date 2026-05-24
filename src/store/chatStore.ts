import { create } from 'zustand';

import type { AiChatMessage, ChatMessage, UserChatMessage } from '@/features/ai-chat/types';

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type ChatStoreState = {
  messages: ChatMessage[];
  inputText: string;
  isStreaming: boolean;
  error: string | null;
};

export type ChatStoreActions = {
  setInputText: (text: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  addUserMessage: (content: string) => UserChatMessage;
  addAssistantPlaceholder: () => AiChatMessage;
  updateAssistantMessage: (id: string, patch: Partial<AiChatMessage>) => void;
  setIsStreaming: (value: boolean) => void;
  reset: () => void;
};

export type ChatStore = ChatStoreState & ChatStoreActions;

const initialState: ChatStoreState = {
  messages: [],
  inputText: '',
  isStreaming: false,
  error: null,
};

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  setInputText: (text) => set({ inputText: text }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  addUserMessage: (content) => {
    const message: UserChatMessage = {
      id: createId(),
      role: 'user',
      content: content.trim(),
      createdAt: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  addAssistantPlaceholder: () => {
    const message: AiChatMessage = {
      id: createId(),
      role: 'assistant',
      english: '',
      chinese: '',
      grammarCorrection: '',
      vocabulary: [],
      createdAt: Date.now(),
      isStreaming: true,
      isError: false,
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  updateAssistantMessage: (id, patch) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.role === 'assistant' && msg.id === id ? { ...msg, ...patch } : msg,
      ),
    }));
  },

  setIsStreaming: (value) => set({ isStreaming: value }),

  reset: () => set(initialState),
}));

export function selectCanSendChat(state: ChatStore): boolean {
  return state.inputText.trim().length > 0 && !state.isStreaming;
}
