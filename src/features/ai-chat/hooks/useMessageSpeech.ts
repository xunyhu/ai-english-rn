import { useCallback } from 'react';

import { selectAudioState, useAudioStore } from '@/store/audioStore';

/** @deprecated Prefer useMessageSpeechPlay + useMessageAudioState in list rows */
export function useMessageSpeech() {
  const speechError = useAudioStore((state) => state.error);
  const play = useAudioStore((state) => state.play);
  const clearSpeechError = useAudioStore((state) => state.clearError);

  const getMessageSpeechState = useCallback((messageId: string) => {
    return selectAudioState(messageId, 'chat')(useAudioStore.getState());
  }, []);

  const onPlayMessageAudio = useCallback(
    (messageId: string, text: string) => {
      void play({ id: messageId, text, scope: 'chat' });
    },
    [play],
  );

  return {
    getMessageSpeechState,
    onPlayMessageAudio,
    speechError,
    clearSpeechError,
  };
}
