import type { ChatBubbleSection } from '@/components';

import type { FeedbackInterviewMessage } from '../types';

export function buildFeedbackSections(
  message: FeedbackInterviewMessage,
  labels: {
    grammarLabel: string;
    betterAnswerLabel: string;
    vocabularyLabel: string;
  },
): ChatBubbleSection[] {
  const sections: ChatBubbleSection[] = [];

  if (message.grammarCorrection) {
    sections.push({
      label: labels.grammarLabel,
      content: message.grammarCorrection,
      tone: 'warning',
    });
  }

  if (message.betterAnswer) {
    sections.push({
      label: labels.betterAnswerLabel,
      content: message.betterAnswer,
      tone: 'body',
    });
  }

  if (!message.isError && message.vocabulary.length > 0) {
    sections.push({
      label: labels.vocabularyLabel,
      content: '',
      tags: message.vocabulary,
    });
  }

  return sections;
}

export function getFeedbackBubbleState(message: FeedbackInterviewMessage) {
  const showThinking =
    message.isStreaming &&
    !message.grammarCorrection &&
    !message.betterAnswer &&
    message.vocabulary.length === 0;

  return { showThinking, isError: message.isError === true };
}
