import { useCallback } from 'react';

import {
  selectShadowingIsLoading,
  selectShadowingIsPlaying,
  useAudioStore,
} from '@/store/audioStore';

import { useShadowingStore } from '../store/shadowing-store';

export function useShadowingPlayback() {
  const isPlaying = useAudioStore(selectShadowingIsPlaying);
  const isPlayLoading = useAudioStore(selectShadowingIsLoading);
  const play = useAudioStore((state) => state.play);
  const stop = useAudioStore((state) => state.stop);
  const setError = useShadowingStore((state) => state.setError);

  const playSentence = useCallback(
    (sentenceId: string, english: string) => {
      if (isPlaying) {
        stop();
        return;
      }

      setError(null);
      void play({
        id: sentenceId,
        text: english,
        scope: 'shadowing',
        cacheKey: `shadowing-${sentenceId}`,
      });
    },
    [isPlaying, play, setError, stop],
  );

  const stopPlayback = useCallback(() => {
    stop();
  }, [stop]);

  return { playSentence, stopPlayback, isPlaying, isPlayLoading };
}
