import { useCallback } from 'react';

import { useAudioStore } from '@/store/audioStore';

/** Stable play handler for list rows — audio UI state is subscribed per row. */
export function useMessageSpeechPlay() {
  const play = useAudioStore((state) => state.play);

  return useCallback(
    (messageId: string, text: string) => {
      void play({ id: messageId, text, scope: 'chat' });
    },
    [play],
  );
}
