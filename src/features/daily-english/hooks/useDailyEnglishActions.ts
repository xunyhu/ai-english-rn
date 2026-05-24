import { useCallback } from 'react';

import { selectAudioState, useAudioStore } from '@/store/audioStore';
import { useUserStore } from '@/store/userStore';

export function useDailyEnglishActions(
  sentenceId: string | undefined,
  english: string | undefined,
) {
  const play = useAudioStore((state) => state.play);
  const toggleFavoriteSentence = useUserStore((state) => state.toggleFavoriteSentence);
  const isFavorited = useUserStore((state) =>
    sentenceId ? state.isFavoriteSentence(sentenceId) : false,
  );

  const audioState =
    sentenceId != null
      ? selectAudioState(sentenceId, 'daily-english')(useAudioStore.getState())
      : { isLoading: false, isPlaying: false, hasPlayed: false };

  const onPlayAudio = useCallback(() => {
    if (!sentenceId || !english?.trim() || audioState.isPlaying || audioState.isLoading) {
      return;
    }

    void play({
      id: sentenceId,
      text: english,
      scope: 'daily-english',
      cacheKey: `daily-${sentenceId}`,
    });
  }, [sentenceId, english, audioState.isPlaying, audioState.isLoading, play]);

  const onToggleFavorite = useCallback(() => {
    if (!sentenceId) return;
    toggleFavoriteSentence(sentenceId);
  }, [sentenceId, toggleFavoriteSentence]);

  return {
    isPlaying: audioState.isPlaying,
    isPlayLoading: audioState.isLoading,
    isFavorited,
    onPlayAudio,
    onToggleFavorite,
  };
}
