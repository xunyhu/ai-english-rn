import {
  ENGLISH_TEACHER_SYSTEM_PROMPT,
  type ChatCompletionMessage,
} from '@/services/openai';

import type { AiChatMessage, ChatMessage } from '../types';

function formatAssistantForApi(message: AiChatMessage): string {
  const parts = [
    `## English\n${message.english}`,
    message.chinese ? `## Chinese\n${message.chinese}` : '',
    message.grammarCorrection ? `## Grammar\n${message.grammarCorrection}` : '',
    message.vocabulary.length > 0
      ? `## Vocabulary\n${message.vocabulary.join(', ')}`
      : '',
  ].filter(Boolean);

  return parts.join('\n\n');
}

export function buildApiMessages(
  history: ChatMessage[],
  userMessage: string,
): ChatCompletionMessage[] {
  const messages: ChatCompletionMessage[] = [
    { role: 'system', content: ENGLISH_TEACHER_SYSTEM_PROMPT },
  ];

  for (const msg of history) {
    if (msg.role === 'user') {
      messages.push({ role: 'user', content: msg.content });
      continue;
    }

    if (msg.isError) continue;

    const content = formatAssistantForApi(msg);
    if (content.trim()) {
      messages.push({ role: 'assistant', content });
    }
  }

  messages.push({ role: 'user', content: userMessage });
  return messages;
}
