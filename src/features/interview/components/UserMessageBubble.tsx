import { memo } from 'react';

import { ChatBubble } from '@/components';

import type { UserInterviewMessage } from '../types';

type UserMessageBubbleProps = {
  message: UserInterviewMessage;
  youLabel: string;
};

function UserMessageBubbleComponent({ message, youLabel }: UserMessageBubbleProps) {
  return (
    <ChatBubble variant="user" align="right" label={youLabel}>
      {message.content}
    </ChatBubble>
  );
}

export const UserMessageBubble = memo(
  UserMessageBubbleComponent,
  (prev, next) => prev.message === next.message,
);
