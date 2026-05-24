import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  ContinueLearning,
  DailyEnglish,
  StudyProgress,
} from '@/features/daily-english/types';

import { useProgressStore } from '@/store/progressStore';

import { completeChat, extractSection, OpenAIServiceError } from './openai';

const DAILY_CACHE_PREFIX = 'daily-english:';

const DAILY_SYSTEM_PROMPT = `You create a "Daily English" sentence for Chinese programmers learning English.
Use B1–B2 level, one practical or motivating sentence about work, learning, or communication.
Respond using exactly:
## English
[sentence]
## Chinese
[Simplified Chinese translation]`;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function readCachedDaily(date: string): Promise<DailyEnglish | null> {
  const raw = await AsyncStorage.getItem(`${DAILY_CACHE_PREFIX}${date}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyEnglish;
  } catch {
    return null;
  }
}

async function writeCachedDaily(date: string, sentence: DailyEnglish): Promise<void> {
  await AsyncStorage.setItem(`${DAILY_CACHE_PREFIX}${date}`, JSON.stringify(sentence));
}

async function generateDailyEnglish(date: string): Promise<DailyEnglish> {
  const content = await completeChat({
    messages: [
      { role: 'system', content: DAILY_SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate today's daily English sentence for ${date}.`,
      },
    ],
    temperature: 0.8,
  });

  const english = extractSection(content, 'English');
  const chinese = extractSection(content, 'Chinese');

  if (!english) {
    throw new OpenAIServiceError('Could not generate daily English sentence.');
  }

  return {
    id: `daily-${date}`,
    english,
    chinese: chinese || '',
  };
}

export async function fetchDailyEnglish(): Promise<DailyEnglish> {
  const date = todayKey();
  const cached = await readCachedDaily(date);
  if (cached) return cached;

  const sentence = await generateDailyEnglish(date);
  await writeCachedDaily(date, sentence);
  return sentence;
}

export async function fetchContinueLearning(): Promise<ContinueLearning> {
  return useProgressStore.getState().getContinueLearning();
}

export async function fetchStudyProgress(): Promise<StudyProgress> {
  return useProgressStore.getState().getStudyProgress();
}
