import { memo, useCallback } from 'react';
import { FlatList, type ListRenderItem } from 'react-native';

import { useAutoScrollToEnd } from '@/hooks/useAutoScrollToEnd';
import { FLATLIST_CHAT_PROPS, getListTailScrollKey } from '@/utils/flat-list';

import { INTERVIEW_COPY } from '../constants';
import type { InterviewMessage } from '../types';
import { InterviewEmptyState } from './InterviewEmptyState';
import { InterviewListItem } from './InterviewListItem';

type InterviewMessageListProps = {
  messages: InterviewMessage[];
  hasScenario: boolean;
};

const keyExtractor = (item: InterviewMessage) => item.id;

function InterviewMessageListComponent({ messages, hasScenario }: InterviewMessageListProps) {
  const tailKey = getListTailScrollKey(messages);
  const { listRef, onContentSizeChange } = useAutoScrollToEnd<InterviewMessage>(tailKey);

  const renderItem: ListRenderItem<InterviewMessage> = useCallback(
    ({ item }) => <InterviewListItem item={item} />,
    [],
  );

  if (!hasScenario) {
    return (
      <InterviewEmptyState
        title={INTERVIEW_COPY.emptyTitle}
        description={INTERVIEW_COPY.emptyDescription}
      />
    );
  }

  if (messages.length === 0) {
    return (
      <InterviewEmptyState
        title={INTERVIEW_COPY.streamingLabel}
        description={INTERVIEW_COPY.waitingForAnswer}
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

export const InterviewMessageList = memo(InterviewMessageListComponent);
