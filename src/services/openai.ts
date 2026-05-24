import { assertOpenAIConfigured, env } from '@/config/env';

export const ENGLISH_TEACHER_SYSTEM_PROMPT = `You are an English teacher for Chinese programmers. Always provide English answer, Chinese translation, grammar correction, and key vocabulary.

Respond using exactly these section headers:
## English
[Your English answer]

## Chinese
[Chinese translation]

## Grammar
[Grammar correction or tip for the user's message]

## Vocabulary
[Comma-separated key vocabulary words]`;

export type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type TutorResponse = {
  english: string;
  chinese: string;
  grammarCorrection: string;
  vocabulary: string[];
};

export type StreamCompletionOptions<T> = {
  messages: ChatCompletionMessage[];
  signal?: AbortSignal;
  parse: (content: string) => T;
  onDelta: (accumulatedContent: string, parsed: T) => void;
};

export type StreamChatCompletionOptions = {
  messages: ChatCompletionMessage[];
  signal?: AbortSignal;
  onDelta: (accumulatedContent: string, parsed: TutorResponse) => void;
  parse?: (content: string) => TutorResponse;
};

export class OpenAIServiceError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'OpenAIServiceError';
    this.statusCode = statusCode;
  }
}

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

export function getOpenAIApiKey(): string {
  assertOpenAIConfigured();
  return env.openaiApiKey;
}

export function extractSection(text: string, sectionName: string): string {
  const pattern = new RegExp(
    `##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'i',
  );
  const match = text.match(pattern);
  return match?.[1]?.trim() ?? '';
}

export function parseTutorResponse(content: string): TutorResponse {
  const english = extractSection(content, 'English');
  const chinese = extractSection(content, 'Chinese');
  const grammarCorrection = extractSection(content, 'Grammar');
  const vocabularyRaw = extractSection(content, 'Vocabulary');

  const vocabulary = vocabularyRaw
    ? vocabularyRaw
        .split(/[,，、\n]/)
        .map((word) => word.trim().replace(/^[-•]\s*/, ''))
        .filter(Boolean)
    : [];

  if (!english && !chinese && !grammarCorrection && vocabulary.length === 0 && content.trim()) {
    return {
      english: content.trim(),
      chinese: '',
      grammarCorrection: '',
      vocabulary: [],
    };
  }

  return {
    english,
    chinese,
    grammarCorrection,
    vocabulary,
  };
}

function parseOpenAIErrorBody(body: string): string | null {
  try {
    const json = JSON.parse(body) as { error?: { message?: string } };
    return json.error?.message ?? null;
  } catch {
    return body.trim() || null;
  }
}

async function readNonStreamingResponse(response: Response): Promise<string> {
  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new OpenAIServiceError('OpenAI returned an empty response.');
  }
  return content;
}

function parseSseLines(
  chunk: string,
  onContent: (delta: string) => void,
): void {
  const lines = chunk.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;

    const data = trimmed.slice(5).trim();
    if (data === '[DONE]') continue;

    try {
      const parsed = JSON.parse(data) as {
        choices?: { delta?: { content?: string } }[];
      };
      const delta = parsed.choices?.[0]?.delta?.content;
      if (delta) onContent(delta);
    } catch {
      // Ignore malformed SSE chunks
    }
  }
}

async function streamViaReader(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onContent: (delta: string) => void,
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      parseSseLines(part, onContent);
    }
  }

  if (buffer.trim()) {
    parseSseLines(buffer, onContent);
  }
}

export async function streamCompletion<T>({
  messages,
  signal,
  parse,
  onDelta,
}: StreamCompletionOptions<T>): Promise<string> {
  const apiKey = getOpenAIApiKey();

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiModel,
      messages,
      stream: true,
      temperature: 0.7,
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new OpenAIServiceError(
      parseOpenAIErrorBody(body) ?? `OpenAI request failed (${response.status})`,
      response.status,
    );
  }

  let fullContent = '';

  const emit = (delta: string) => {
    fullContent += delta;
    onDelta(fullContent, parse(fullContent));
  };

  const reader = response.body?.getReader();
  if (reader) {
    await streamViaReader(reader, emit);
    return fullContent;
  }

  const content = await readNonStreamingResponse(response);
  emit(content);
  return fullContent;
}

export type CompleteChatOptions = {
  messages: ChatCompletionMessage[];
  signal?: AbortSignal;
  temperature?: number;
};

export async function completeChat({
  messages,
  signal,
  temperature = 0.7,
}: CompleteChatOptions): Promise<string> {
  const apiKey = getOpenAIApiKey();

  const response = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: env.openaiModel,
      messages,
      stream: false,
      temperature,
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new OpenAIServiceError(
      parseOpenAIErrorBody(body) ?? `OpenAI request failed (${response.status})`,
      response.status,
    );
  }

  return readNonStreamingResponse(response);
}

export async function streamChatCompletion({
  messages,
  signal,
  onDelta,
  parse = parseTutorResponse,
}: StreamChatCompletionOptions): Promise<string> {
  return streamCompletion({ messages, signal, parse, onDelta });
}
