import { memo } from 'react';

import { INTERVIEW_COPY } from '../constants';
import type { InterviewMessage } from '../types';
import { FeedbackBubble } from './FeedbackBubble';
import { QuestionBubble } from './QuestionBubble';
import { UserMessageBubble } from './UserMessageBubble';

type InterviewListItemProps = {
  item: InterviewMessage;
};

function InterviewListItemComponent({ item }: InterviewListItemProps) {
  if (item.role === 'user') {
    return <UserMessageBubble message={item} youLabel={INTERVIEW_COPY.youLabel} />;
  }

  if (item.kind === 'question') {
    return (
      <QuestionBubble
        message={item}
        interviewerLabel={INTERVIEW_COPY.interviewerLabel}
        streamingLabel={INTERVIEW_COPY.streamingLabel}
      />
    );
  }

  return (
    <FeedbackBubble
      message={item}
      interviewerLabel={INTERVIEW_COPY.interviewerLabel}
      grammarLabel={INTERVIEW_COPY.grammarLabel}
      betterAnswerLabel={INTERVIEW_COPY.betterAnswerLabel}
      vocabularyLabel={INTERVIEW_COPY.vocabularyLabel}
      streamingLabel={INTERVIEW_COPY.streamingLabel}
    />
  );
}

export const InterviewListItem = memo(
  InterviewListItemComponent,
  (prev, next) => prev.item === next.item,
);
