export type AppEnvironment = 'development' | 'production' | 'preview';

function readAppEnv(): AppEnvironment {
  const value = process.env.EXPO_PUBLIC_APP_ENV?.trim().toLowerCase();
  if (value === 'production' || value === 'preview' || value === 'development') {
    return value;
  }
  return __DEV__ ? 'development' : 'production';
}

export const env = {
  appEnv: readAppEnv(),
  isDev: readAppEnv() === 'development',
  isProduction: readAppEnv() === 'production',
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '',
  openaiModel: process.env.EXPO_PUBLIC_OPENAI_MODEL?.trim() || 'gpt-4o-mini',
  openaiWhisperModel: process.env.EXPO_PUBLIC_OPENAI_WHISPER_MODEL?.trim() || 'whisper-1',
} as const;

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!env.openaiApiKey) {
    missing.push('EXPO_PUBLIC_OPENAI_API_KEY');
  }
  return { valid: missing.length === 0, missing };
}

export function assertOpenAIConfigured(): void {
  const { valid, missing } = validateEnv();
  if (!valid) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(', ')}. Copy .env.example to .env and add your OpenAI API key.`,
    );
  }
}
