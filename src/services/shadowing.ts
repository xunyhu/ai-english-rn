import { env } from '@/config/env';
import { AppError } from '@/lib/errors';

import type { ShadowingResult, ShadowingSentence } from '@/features/shadowing/types';

import { completeChat, extractSection, getOpenAIApiKey, OpenAIServiceError } from './openai';

const OPENAI_TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions';

const SENTENCE_SYSTEM_PROMPT = `You create English shadowing practice sentences for Chinese programmers.
Use natural spoken English at B1–B2 level (workplace or daily tech communication).
Respond using exactly:
## English
[sentence]
## Chinese
[Simplified Chinese translation]
## Difficulty
[easy, medium, or hard]`;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function parseDifficulty(value: string): ShadowingSentence['difficulty'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'easy' || normalized === 'medium' || normalized === 'hard') {
    return normalized;
  }
  return 'medium';
}

export async function fetchShadowingSentence(): Promise<ShadowingSentence> {
  const content = await completeChat({
    messages: [
      { role: 'system', content: SENTENCE_SYSTEM_PROMPT },
      {
        role: 'user',
        content: 'Generate one new shadowing sentence.',
      },
    ],
    temperature: 0.9,
  });

  const english = extractSection(content, 'English');
  const chinese = extractSection(content, 'Chinese');
  const difficulty = parseDifficulty(extractSection(content, 'Difficulty'));

  if (!english) {
    throw new OpenAIServiceError('Could not generate a shadowing sentence.');
  }

  return {
    id: createId(),
    english,
    chinese: chinese || '',
    difficulty,
  };
}

async function transcribeRecording(recordingUri: string): Promise<string> {
  const apiKey = getOpenAIApiKey();
  const formData = new FormData();

  formData.append('file', {
    uri: recordingUri,
    name: 'recording.m4a',
    type: 'audio/m4a',
  } as unknown as Blob);
  formData.append('model', env.openaiWhisperModel);
  formData.append('language', 'en');

  const response = await fetch(OPENAI_TRANSCRIBE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new OpenAIServiceError(
      `Transcription failed (${response.status}): ${body.slice(0, 120)}`,
      response.status,
    );
  }

  const json = (await response.json()) as { text?: string };
  const text = json.text?.trim();
  if (!text) {
    throw new OpenAIServiceError('Transcription returned empty text.');
  }
  return text;
}

export async function evaluateShadowingRecording(
  expectedText: string,
  recordingUri: string | null,
): Promise<ShadowingResult> {
  if (!recordingUri) {
    throw new AppError('No recording found. Please record again.');
  }

  const transcript = await transcribeRecording(recordingUri);

  const content = await completeChat({
    messages: [
      {
        role: 'system',
        content:
          'You evaluate English shadowing practice for Chinese programmers. Be encouraging and specific about pronunciation, rhythm, and word stress.',
      },
      {
        role: 'user',
        content: `Target sentence: "${expectedText}"
Learner transcript: "${transcript}"

Respond using exactly:
## Score
[integer 0-100 for overall accuracy]

## Feedback
[2-3 short sentences of actionable feedback in English]`,
      },
    ],
    temperature: 0.5,
  });

  const scoreRaw = extractSection(content, 'Score');
  const feedback = extractSection(content, 'Feedback');
  const parsedScore = Number.parseInt(scoreRaw.replace(/[^\d]/g, ''), 10);
  const accuracyScore = Number.isFinite(parsedScore)
    ? Math.min(100, Math.max(0, parsedScore))
    : 70;

  return {
    accuracyScore,
    feedback: feedback || 'Good effort. Listen again and focus on matching the rhythm of the model sentence.',
  };
}
