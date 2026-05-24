import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { getErrorMessage } from '@/lib/errors';
import { stopSpeech } from '@/services/speech-playback';
import { recordFeatureActivity } from '@/store/progressStore';

import { SHADOWING_COPY } from '../constants';
import { evaluateShadowingRecording } from '../services/shadowing-api';
import { useShadowingStore } from '../store/shadowing-store';
import { useShadowingPlayback } from './useShadowingPlayback';
import type { useShadowingRecorder } from './useShadowingRecorder';
import { shadowingSentenceQueryKey, useShadowingSentence } from './useShadowingSentence';

type RecorderApi = ReturnType<typeof useShadowingRecorder>;

export function useShadowingScreen(recorder: RecorderApi) {
  const queryClient = useQueryClient();
  const sentenceQuery = useShadowingSentence();
  const { playSentence, stopPlayback, isPlaying, isPlayLoading } = useShadowingPlayback();

  const phase = useShadowingStore((state) => state.phase);
  const result = useShadowingStore((state) => state.result);
  const error = useShadowingStore((state) => state.error);
  const setPhase = useShadowingStore((state) => state.setPhase);
  const setResult = useShadowingStore((state) => state.setResult);
  const setError = useShadowingStore((state) => state.setError);
  const resetSession = useShadowingStore((state) => state.resetSession);

  const sentence = sentenceQuery.data;
  const isLoadingSentence = sentenceQuery.isLoading;
  const isEvaluating = phase === 'evaluating';
  const waveActive = isPlaying || recorder.isRecording || isPlayLoading;

  useEffect(() => {
    if (sentenceQuery.isLoading) {
      setPhase('loading');
      return;
    }
    if (sentenceQuery.isError) {
      setError(
        getErrorMessage(sentenceQuery.error, 'Failed to load sentence. Tap Next to try again.'),
      );
      setPhase('practice');
      return;
    }
    if (sentence && phase === 'loading') {
      setPhase('practice');
    }
  }, [sentenceQuery.isLoading, sentenceQuery.isError, sentence, phase, setPhase, setError]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const onPlay = useCallback(() => {
    if (!sentence || isEvaluating) return;
    playSentence(sentence.id, sentence.english);
  }, [sentence, isEvaluating, playSentence]);

  const onToggleRecord = useCallback(async () => {
    if (!sentence || isEvaluating || isPlayLoading) return;

    if (recorder.isRecording) {
      stopPlayback();
      setPhase('evaluating');
      setError(null);

      try {
        const uri = await recorder.stopRecording();
        const evaluation = await evaluateShadowingRecording(sentence.english, uri);
        setResult(evaluation);
        recordFeatureActivity(
          '/shadowing',
          {
            title: 'Shadowing',
            subtitle: 'Listen and repeat practice',
            progressPercent: Math.min(100, evaluation.accuracyScore),
          },
          { minutes: 3 },
        );
      } catch (err) {
        setError(getErrorMessage(err, 'Could not analyze your recording. Please try again.'));
        setPhase('practice');
        setResult(null);
      }
      return;
    }

    stopPlayback();
    setResult(null);
    const started = await recorder.startRecording();
    if (!started && recorder.permissionError) {
      setError(recorder.permissionError);
    }
  }, [
    sentence,
    isEvaluating,
    isPlayLoading,
    recorder,
    stopPlayback,
    setPhase,
    setError,
    setResult,
  ]);

  const onNextSentence = useCallback(async () => {
    stopPlayback();
    resetSession();
    setPhase('loading');
    await queryClient.fetchQuery({
      queryKey: shadowingSentenceQueryKey,
      queryFn: () => import('../services/shadowing-api').then((m) => m.fetchShadowingSentence()),
    });
  }, [queryClient, resetSession, setPhase, stopPlayback]);

  const onTryAgain = useCallback(() => {
    stopPlayback();
    resetSession();
  }, [resetSession, stopPlayback]);

  const clearError = useCallback(() => {
    setError(null);
    recorder.clearPermissionError();
  }, [setError, recorder]);

  return {
    copy: SHADOWING_COPY,
    sentence,
    result,
    phase,
    isLoadingSentence,
    isEvaluating,
    isPlaying,
    isPlayLoading,
    isRecording: recorder.isRecording,
    recordingDurationMs: recorder.recordingDurationMs,
    waveActive,
    error: error ?? recorder.permissionError,
    onPlay,
    onToggleRecord,
    onNextSentence,
    onTryAgain,
    clearError,
    canPlay: Boolean(sentence) && !isEvaluating && !recorder.isRecording,
    canRecord: Boolean(sentence) && !isEvaluating && !isPlaying && !isPlayLoading,
  };
}
