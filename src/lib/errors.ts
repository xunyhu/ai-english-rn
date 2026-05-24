import { OpenAIServiceError } from '@/services/openai';
import { TTSServiceError } from '@/services/tts';

export class AppError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAbortError(error)) {
    return 'Request was cancelled.';
  }

  if (error instanceof OpenAIServiceError || error instanceof TTSServiceError || error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
