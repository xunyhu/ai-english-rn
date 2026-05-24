export type UserChatMessage = {
  id: string;
  role: 'user';
  content: string;
  createdAt: number;
};

export type AiChatMessage = {
  id: string;
  role: 'assistant';
  english: string;
  chinese: string;
  grammarCorrection: string;
  vocabulary: string[];
  createdAt: number;
  isStreaming: boolean;
  isError?: boolean;
};

export type ChatMessage = UserChatMessage | AiChatMessage;

export type { TutorResponse } from '@/services/openai';
