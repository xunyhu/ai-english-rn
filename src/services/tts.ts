import * as FileSystem from 'expo-file-system/legacy';

import { getOpenAIApiKey, OpenAIServiceError } from './openai';

const OPENAI_SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
const TTS_MODEL = 'tts-1';
const TTS_VOICE = 'nova';
const MAX_INPUT_CHARS = 4096;
const TTS_CACHE_DIR = `${FileSystem.cacheDirectory}tts/`;

export class TTSServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TTSServiceError';
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

async function ensureCacheDir(): Promise<void> {
  const info = await FileSystem.getInfoAsync(TTS_CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(TTS_CACHE_DIR, { intermediates: true });
  }
}

function getCachePath(cacheKey: string): string {
  const safeKey = cacheKey.replace(/[^a-zA-Z0-9-_]/g, '_');
  return `${TTS_CACHE_DIR}${safeKey}.mp3`;
}

async function readCachedUri(cacheKey: string): Promise<string | null> {
  const path = getCachePath(cacheKey);
  const info = await FileSystem.getInfoAsync(path);
  return info.exists ? path : null;
}

async function writeCache(cacheKey: string, arrayBuffer: ArrayBuffer): Promise<string> {
  await ensureCacheDir();
  const path = getCachePath(cacheKey);
  const base64 = arrayBufferToBase64(arrayBuffer);
  await FileSystem.writeAsStringAsync(path, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return path;
}

function parseOpenAIErrorBody(body: string): string | null {
  try {
    const json = JSON.parse(body) as { error?: { message?: string } };
    return json.error?.message ?? null;
  } catch {
    return body.trim() || null;
  }
}

export async function fetchSpeechAudioUri(text: string, cacheKey: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new TTSServiceError('No text to speak.');
  }

  const cached = await readCachedUri(cacheKey);
  if (cached) return cached;

  const apiKey = getOpenAIApiKey();
  const response = await fetch(OPENAI_SPEECH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: trimmed.slice(0, MAX_INPUT_CHARS),
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new OpenAIServiceError(
      parseOpenAIErrorBody(body) ?? `TTS request failed (${response.status})`,
      response.status,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  return writeCache(cacheKey, arrayBuffer);
}
