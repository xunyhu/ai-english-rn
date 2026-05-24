import { memo } from 'react';

import { ChatBubble } from '@/components';

import type { UserChatMessage } from '../types';

type UserMessageBubbleProps = {
  message: UserChatMessage;
};

function UserMessageBubbleComponent({ message }: UserMessageBubbleProps) {
  return (
    <ChatBubble variant="user" align="right">
      {message.content}
    </ChatBubble>
  );
}

export const UserMessageBubble = memo(
  UserMessageBubbleComponent,
  (prev, next) => prev.message === next.message,
);
