import { memo, useMemo } from 'react';

import { ChatBubble } from '@/components';

import {
  buildFeedbackSections,
  getFeedbackBubbleState,
} from '../lib/build-feedback-sections';
import type { FeedbackInterviewMessage } from '../types';

type FeedbackBubbleProps = {
  message: FeedbackInterviewMessage;
  interviewerLabel: string;
  grammarLabel: string;
  betterAnswerLabel: string;
  vocabularyLabel: string;
  streamingLabel: string;
};

function FeedbackBubbleComponent({
  message,
  interviewerLabel,
  grammarLabel,
  betterAnswerLabel,
  vocabularyLabel,
  streamingLabel,
}: FeedbackBubbleProps) {
  const labels = useMemo(
    () => ({ grammarLabel, betterAnswerLabel, vocabularyLabel }),
    [grammarLabel, betterAnswerLabel, vocabularyLabel],
  );

  const { showThinking, isError } = useMemo(() => getFeedbackBubbleState(message), [message]);

  const sections = useMemo(
    () => (showThinking ? [] : buildFeedbackSections(message, labels)),
    [message, labels, showThinking],
  );

  return (
    <ChatBubble
      variant={isError ? 'error' : 'assistant-accent'}
      label={interviewerLabel}
      isStreaming={showThinking || message.isStreaming}
      streamingLabel={streamingLabel}
      sections={sections}
    />
  );
}

export const FeedbackBubble = memo(
  FeedbackBubbleComponent,
  (prev, next) => prev.message === next.message,
);
