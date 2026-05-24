import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { selectAudioState, useAudioStore, type AudioStore } from '@/store/audioStore';

export function useMessageAudioState(messageId: string) {
  const selector = useCallback(
    (state: AudioStore) => selectAudioState(messageId, 'chat')(state),
    [messageId],
  );

  return useAudioStore(useShallow(selector));
}
