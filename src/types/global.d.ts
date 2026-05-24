declare module '*.css';

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_OPENAI_API_KEY?: string;
    EXPO_PUBLIC_OPENAI_MODEL?: string;
    EXPO_PUBLIC_OPENAI_WHISPER_MODEL?: string;
    EXPO_PUBLIC_APP_ENV?: 'development' | 'production' | 'preview';
  }
}
