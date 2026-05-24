import { memo, useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import { useAutoScrollToEnd } from '@/hooks/useAutoScrollToEnd';
import { FLATLIST_CHAT_PROPS, getListTailScrollKey } from '@/utils/flat-list';

import type { ChatMessage } from '../types';
import { ChatEmptyState } from './ChatEmptyState';
import { ChatListItem } from './ChatListItem';
import { CHAT_COPY } from '../constants';

type ChatMessageListProps = {
  messages: ChatMessage[];
  onPlayMessageAudio: (messageId: string, text: string) => void;
};

const keyExtractor = (item: ChatMessage) => item.id;

function ChatMessageListComponent({ messages, onPlayMessageAudio }: ChatMessageListProps) {
  const tailKey = getListTailScrollKey(messages);
  const { listRef, onContentSizeChange } = useAutoScrollToEnd<ChatMessage>(tailKey);

  const renderItem: ListRenderItem<ChatMessage> = useCallback(
    ({ item }) => <ChatListItem item={item} onPlayMessageAudio={onPlayMessageAudio} />,
    [onPlayMessageAudio],
  );

  if (messages.length === 0) {
    return (
      <ChatEmptyState
        title={CHAT_COPY.emptyTitle}
        description={CHAT_COPY.emptyDescription}
      />
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="px-4 pt-2 pb-4"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={onContentSizeChange}
      {...FLATLIST_CHAT_PROPS}
    />
  );
}

export const ChatMessageList = memo(ChatMessageListComponent);
