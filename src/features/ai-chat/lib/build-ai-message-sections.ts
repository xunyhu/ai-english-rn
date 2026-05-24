import type { ChatBubbleSection } from '@/components';

import type { CHAT_COPY } from '../constants';
import type { AiChatMessage } from '../types';

type ChatCopy = typeof CHAT_COPY;

export function buildAiMessageSections(
  message: AiChatMessage,
  copy: ChatCopy,
): ChatBubbleSection[] {
  if (message.isError) return [];

  const sections: ChatBubbleSection[] = [];

  if (message.chinese) {
    sections.push({
      label: copy.translationLabel,
      content: message.chinese,
      tone: 'muted',
    });
  }

  if (message.grammarCorrection) {
    sections.push({
      label: copy.grammarLabel,
      content: message.grammarCorrection,
      tone: 'warning',
    });
  }

  if (message.vocabulary.length > 0) {
    sections.push({
      label: copy.vocabularyLabel,
      content: '',
      tags: message.vocabulary,
    });
  }

  return sections;
}

export function getAiMessageBubbleState(message: AiChatMessage) {
  const isError = message.isError === true;
  const showThinking = message.isStreaming && !message.english;
  const canPlayAudio = !isError && !message.isStreaming && Boolean(message.english.trim());

  return { isError, showThinking, canPlayAudio };
}
