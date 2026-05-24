import { memo, useCallback } from 'react';

import { CHAT_COPY } from '../constants';
import type { ChatMessage } from '../types';
import { useMessageAudioState } from '../hooks/useMessageAudioState';
import { AiMessageBubble } from './AiMessageBubble';
import { UserMessageBubble } from './UserMessageBubble';

type ChatListItemProps = {
  item: ChatMessage;
  onPlayMessageAudio: (messageId: string, text: string) => void;
};

function AiChatListItem({
  message,
  onPlayMessageAudio,
}: {
  message: Extract<ChatMessage, { role: 'assistant' }>;
  onPlayMessageAudio: (messageId: string, text: string) => void;
}) {
  const { isPlaying, isLoading, hasPlayed } = useMessageAudioState(message.id);

  const onPlayAudio = useCallback(() => {
    onPlayMessageAudio(message.id, message.english);
  }, [message.id, message.english, onPlayMessageAudio]);

  return (
    <AiMessageBubble
      message={message}
      copy={CHAT_COPY}
      isSpeechPlaying={isPlaying}
      isSpeechLoading={isLoading}
      hasPlayedSpeech={hasPlayed}
      onPlayAudio={onPlayAudio}
    />
  );
}

function ChatListItemComponent({ item, onPlayMessageAudio }: ChatListItemProps) {
  if (item.role === 'user') {
    return <UserMessageBubble message={item} />;
  }

  return <AiChatListItem message={item} onPlayMessageAudio={onPlayMessageAudio} />;
}

function arePropsEqual(prev: ChatListItemProps, next: ChatListItemProps): boolean {
  return prev.item === next.item && prev.onPlayMessageAudio === next.onPlayMessageAudio;
}

export const ChatListItem = memo(ChatListItemComponent, arePropsEqual);
