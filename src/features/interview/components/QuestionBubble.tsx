import { memo, useMemo } from 'react';

import { ChatBubble } from '@/components';

import type { QuestionInterviewMessage } from '../types';

type QuestionBubbleProps = {
  message: QuestionInterviewMessage;
  interviewerLabel: string;
  streamingLabel: string;
};

function QuestionBubbleComponent({
  message,
  interviewerLabel,
  streamingLabel,
}: QuestionBubbleProps) {
  const showThinking = useMemo(
    () => message.isStreaming && !message.question,
    [message.isStreaming, message.question],
  );
  const isError = message.isError === true;

  return (
    <ChatBubble
      variant={isError ? 'error' : 'assistant-accent'}
      label={interviewerLabel}
      isStreaming={showThinking || message.isStreaming}
      streamingLabel={streamingLabel}>
      {!showThinking ? message.question : undefined}
    </ChatBubble>
  );
}

export const QuestionBubble = memo(
  QuestionBubbleComponent,
  (prev, next) => prev.message === next.message,
);
