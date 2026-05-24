export { queryClient } from './query-client';
export {
  fetchContinueLearning,
  fetchDailyEnglish,
  fetchStudyProgress,
} from './daily-english';
export {
  completeChat,
  ENGLISH_TEACHER_SYSTEM_PROMPT,
  extractSection,
  getOpenAIApiKey,
  OpenAIServiceError,
  parseTutorResponse,
  streamChatCompletion,
  streamCompletion,
} from './openai';
export type {
  ChatCompletionMessage,
  CompleteChatOptions,
  StreamChatCompletionOptions,
  StreamCompletionOptions,
  TutorResponse,
} from './openai';
export { evaluateShadowingRecording, fetchShadowingSentence } from './shadowing';
export { fetchSpeechAudioUri, TTSServiceError } from './tts';
export { playEnglishSpeech, stopSpeech } from './speech-playback';
export type { SpeechCallbacks } from './speech-playback';
