import type { FlatListProps } from 'react-native';

/** Sensible defaults for vertical chat-style lists */
export const FLATLIST_CHAT_PROPS = {
  removeClippedSubviews: true,
  initialNumToRender: 12,
  maxToRenderPerBatch: 8,
  windowSize: 9,
  updateCellsBatchingPeriod: 50,
} as const satisfies Partial<FlatListProps<unknown>>;

type TailMessage = {
  id: string;
  role: string;
  kind?: string;
  content?: string;
  english?: string;
  question?: string;
  grammarCorrection?: string;
  betterAnswer?: string;
  isStreaming?: boolean;
};

/** Stable key for auto-scroll — only changes when the last row meaningfully updates */
export function getListTailScrollKey(messages: TailMessage[]): string {
  const last = messages[messages.length - 1];
  if (!last) return 'empty';

  if (last.role === 'user') {
    return `${last.id}:u:${last.content?.length ?? 0}`;
  }

  if (last.kind === 'feedback') {
    const len = (last.grammarCorrection?.length ?? 0) + (last.betterAnswer?.length ?? 0);
    return `${last.id}:f:${len}:${last.isStreaming ? 1 : 0}`;
  }

  const textLen =
    last.english != null
      ? last.english.length
      : last.question != null
        ? last.question.length
        : 0;

  return `${last.id}:a:${textLen}:${last.isStreaming ? 1 : 0}`;
}
